/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
  type ReactNode,
} from "react";
import { motion, MotionConfig } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Toggle } from "~/components/ui/toggle";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useIsMobile } from "~/lib/hooks/use-mobile";
import type { Set } from "~/lib/types/set";
import type { Card } from "~/lib/types/card";

type UtilityBarContextType = {
  showDefinitionFirst: boolean;
  setShowDefinitionFirst: (value: boolean) => void;
  isShuffled: boolean;
  setIsShuffled: (value: boolean) => void;
  close: () => void;
};

const UtilityBarContext = createContext<UtilityBarContextType | null>(null);

export const UtilityBarProvider = ({ children }: { children: ReactNode }) => {
  const [showDefinitionFirst, setShowDefinitionFirst] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const router = useRouter();

  const close = () => router.back();

  const value = {
    showDefinitionFirst,
    setShowDefinitionFirst,
    isShuffled,
    setIsShuffled,
    close,
  };

  return (
    <UtilityBarContext.Provider value={value}>
      {children}
    </UtilityBarContext.Provider>
  );
};

const useUtilityBar = () => {
  const context = useContext(UtilityBarContext);

  if (!context) throw new Error("UtilityBarContext not found");

  return context;
};

const useDefinition = () => {
  return useUtilityBar().showDefinitionFirst;
};

const useShuffle = () => {
  return useUtilityBar().isShuffled;
};

const useMutations = () => {
  const { setShowDefinitionFirst, setIsShuffled, close } = useUtilityBar();

  return {
    setDefinition: setShowDefinitionFirst,
    setShuffle: setIsShuffled,
    close,
  };
};

const UtilityBar = () => {
  const definition = useDefinition();
  const isShuffled = useShuffle();

  const { setDefinition, setShuffle, close } = useMutations();

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              className="size-8"
              pressed={definition}
              onPressedChange={setDefinition}
              aria-label="Toggle definition first"
              data-state={definition ? "on" : "off"}
            >
              <BookOpenText className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            {definition ? "Showing definition first" : "Showing term first"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              className="size-8"
              pressed={isShuffled}
              aria-label="Toggle shuffle"
              onPressedChange={setShuffle}
              data-state={isShuffled ? "on" : "off"}
            >
              <Shuffle className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            {isShuffled ? "Shuffle on" : "Shuffle off"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={close}
              aria-label="Close"
              className="size-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const CardContent = ({
  type,
  text,
  imageUrl,
}: {
  type: "Term" | "Definition";
  text: string | null;
  imageUrl: string | null;
}) => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      <header className="absolute left-4 top-4">{type}</header>
      {text && <div className="text-xl">{text}</div>}
      {imageUrl && (
        <div className="relative h-64 w-full max-w-xs">
          <Image
            src={imageUrl}
            alt={text ?? "Card content"}
            fill
            className="rounded-md object-cover"
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      {!text && !imageUrl && (
        <div className="text-muted-foreground">(No content available)</div>
      )}
    </div>
  );
};

const FlashCard = ({
  card,
  showDefinitionFirst,
}: {
  card: Card;
  showDefinitionFirst: boolean;
}) => {
  const [flip, setFlip] = useState(true);

  const frontContent = showDefinitionFirst
    ? { text: card.definition, imageUrl: card.definitionUrl }
    : { text: card.term, imageUrl: card.termUrl };

  const backContent = showDefinitionFirst
    ? { text: card.term, imageUrl: card.termUrl }
    : { text: card.definition, imageUrl: card.definitionUrl };

  const flipCard = () => {
    setFlip((prevState) => !prevState);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") flipCard();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <MotionConfig transition={{ duration: 0.7, bounce: 0 }}>
        <motion.div
          className="relative h-full w-full rounded-lg border shadow-lg"
          animate={{ rotateY: flip ? 0 : 180 }}
        >
          <motion.div
            animate={{ rotateY: flip ? 0 : 180 }}
            className="relative flex h-full w-full items-center justify-center"
          >
            <motion.div
              transition={{ duration: 0.7 }}
              animate={{ rotateY: flip ? 0 : 180 }}
              className="absolute flex h-full w-full items-center justify-center [backface-visibility:hidden]"
            >
              <CardContent type="Term" {...frontContent} />
            </motion.div>
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: flip ? 180 : 0 }}
              className="absolute flex h-full w-full items-center justify-center [backface-visibility:hidden]"
            >
              <CardContent type="Definition" {...backContent} />
            </motion.div>
          </motion.div>
        </motion.div>
        <button onClick={flipCard}>
          <span className="sr-only">Flip Card</span>
          <span className="absolute inset-0" />
        </button>
      </MotionConfig>
    </div>
  );
};

export function FlashcardViewer({ set }: { set: Set }) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);

  const definition = useDefinition();
  const isShuffled = useShuffle();

  useEffect(() => {
    let cardsToDisplay = [...set.cards];
    if (isShuffled) {
      cardsToDisplay = shuffleArray([...cardsToDisplay]);
    }
    setCards(cardsToDisplay);
    setCurrentIndex(0);
  }, [set.cards, isShuffled]);

  const currentCard = useMemo(() => {
    return cards[currentIndex] ?? null;
  }, [cards, currentIndex]);

  const goToNextCard = () => {
    if (!cards.length) return;

    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const goToPrevCard = () => {
    if (!cards.length) return;

    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleClose = () => {
    router.back();
  };

  const shuffleArray = (array: Card[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j]!, newArray[i]!];
    }
    return newArray;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNextCard();
      else if (e.key === "ArrowLeft") goToPrevCard();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards.length]);

  const CardViewerContent = () => (
    <div className="flex flex-col gap-6 py-4">
      <div className="relative h-[350px] w-full overflow-hidden md:h-[400px]">
        {currentCard && (
          <FlashCard card={currentCard} showDefinitionFirst={definition} />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={goToPrevCard}
          aria-label="Previous card"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={goToNextCard}
          aria-label="Next card"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={true} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="flex items-center justify-between">
            <div>
              <DrawerTitle>{set.name}</DrawerTitle>
              {set.description && (
                <DrawerDescription>{set.description}</DrawerDescription>
              )}
            </div>
            <UtilityBar />
          </DrawerHeader>
          <div className="px-2">
            <CardViewerContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={true} onOpenChange={handleClose}>
      <AlertDialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <div>
            <AlertDialogTitle>{set.name}</AlertDialogTitle>
            {set.description && (
              <AlertDialogDescription>{set.description}</AlertDialogDescription>
            )}
          </div>
          <UtilityBar />
        </AlertDialogHeader>
        <CardViewerContent />
      </AlertDialogContent>
    </AlertDialog>
  );
}
