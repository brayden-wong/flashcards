"use client";

import { FilePen, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";

type Props = {
  set: { id: string; name: string };
};

export const SetCard = ({ set }: Props) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSingleClick = () => {
    cardRef.current?.focus();
  };

  const handleDoubleClick = () => {
    router.push(`/set/${set.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      router.push(`/set/${set.id}`);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={cardRef}
          tabIndex={0}
          className="relative cursor-pointer rounded-md border bg-secondary px-4 py-2 shadow outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onKeyDown={handleKeyDown}
          onClick={handleSingleClick}
          onDoubleClick={handleDoubleClick}
          role="button"
          aria-label={`View set ${set.name}`}
        >
          <div className="flex items-center justify-between gap-2">
            <FileSpreadsheet className="mr-2 flex-shrink-0" />
            <Link
              href={`/set/${set.id}`}
              className="flex-grow overflow-hidden"
              tabIndex={-1}
              aria-hidden="true"
              onClick={(e) => e.preventDefault()}
            >
              <h2 className="truncate text-right text-xl font-semibold">
                {set.name}
              </h2>
            </Link>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          {/* <ContextMenuItem className="relative flex items-center gap-2 hover:bg-accent">
            <SquareArrowOutUpRight className="size-4" />
            <Link href={`/set/${set.id}`} className="">
              Open
            </Link>
          </ContextMenuItem> */}
          <ContextMenuItem className="relative flex items-center gap-2">
            <FilePen />
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
