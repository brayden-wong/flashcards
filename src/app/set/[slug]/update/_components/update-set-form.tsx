"use client";
import {
  useForm,
  useFieldArray,
  type FieldArrayWithId,
  type Control,
} from "react-hook-form";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import { UploadDropzone } from "~/components/ui/uploadthing";
import { request } from "~/lib/utils";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "~/lib/hooks/use-mutation";
import { deleteFiles } from "~/server/uploadthing";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { SubmitButton } from "~/components/ui/submit-button";
import { useRouter } from "next/navigation";
import type { UpdateSetRoute } from "~/app/api/update-set/route";

const DEFAULT_VALUES = {
  id: -1,
  term: "",
  termUrl: "",
  termKey: "",
  definition: "",
  definitionUrl: "",
  definitionKey: "",
};

const CardSchema = z.object({
  id: z.number(),
  term: z.string().min(1, { message: "Term is required" }),
  termUrl: z.string().optional(),
  termKey: z.string().optional(),
  definition: z.string().min(1, { message: "Definition is required" }),
  definitionUrl: z.string().optional(),
  definitionKey: z.string().optional(),
});

const UpdateSetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  cards: z
    .array(CardSchema)
    .min(1, { message: "At least one card is required" }),
});

type UpdateSet = z.infer<typeof UpdateSetSchema>;

type Props = {
  set: UpdateSet;
};

export const UpdateSetForm = ({ set }: Props) => {
  const router = useRouter();

  const form = useForm<UpdateSet>({
    resolver: zodResolver(UpdateSetSchema),
    defaultValues: set,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const addKey = (to: "term" | "definition", key: string, index: number) => {
    if (to === "term") {
      form.setValue(`cards.${index}.termKey`, key);
    } else {
      form.setValue(`cards.${index}.definitionKey`, key);
    }
  };

  const resetCard = (field: "term" | "definition", index: number) => {
    if (field === "term") {
      form.resetField(`cards.${index}.termUrl`);
      form.resetField(`cards.${index}.termKey`);
    } else {
      form.resetField(`cards.${index}.definitionUrl`);
      form.resetField(`cards.${index}.definitionKey`);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data }: { data: UpdateSet }) => {
      const response = await request<UpdateSetRoute>("/api/update-set", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.success) throw new Error(response.error.toString());

      return response.data;
    },
    onError: (err) => toast(err.message),
    onSuccess: (res) => {
      toast(res);

      router.push("/");
    },
  });

  const onSubmit = async (data: UpdateSet) => {
    void mutate({ data });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter set name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="max-h-96"
                  placeholder="Enter set description (optional)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Cards</FormLabel>
            <AddCard append={() => append(DEFAULT_VALUES)} />
          </div>

          {fields.map((field, index) => (
            <CardForm
              key={field.id}
              field={field}
              index={index}
              addKey={addKey}
              remove={remove}
              resetCard={resetCard}
              length={fields.length}
              control={form.control}
            />
          ))}
          <AddCard className="w-full" append={() => append(DEFAULT_VALUES)} />
        </div>

        <SubmitButton isPending={isPending}>Update Set</SubmitButton>
      </form>
    </Form>
  );
};

type CardProps = {
  field: FieldArrayWithId<
    {
      id: string;
      name: string;
      cards: {
        id: number;
        term: string;
        definition: string;
        termUrl?: string | undefined;
        definitionUrl?: string | undefined;
      }[];
      description: string;
    },
    "cards",
    "id"
  >;
  index: number;
  length: number;
  remove: (index: number) => void;
  resetCard: (field: "term" | "definition", index: number) => void;
  addKey: (to: "term" | "definition", key: string, index: number) => void;
  control: Control<
    {
      id: string;
      name: string;
      cards: {
        id: number;
        term: string;
        definition: string;
        termUrl?: string | undefined;
        definitionUrl?: string | undefined;
      }[];
      description: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >;
};

const CardForm = ({
  field,
  length,
  index,
  control,
  addKey,
  remove,
  resetCard,
}: CardProps) => {
  const [keys, setKeys] = useState({ term: "", definition: "" });
  const isEmpty =
    !field.term && !field.termUrl && !field.definition && !field.definitionUrl;

  const resetImage = (field: "term" | "definition") => {
    resetCard(field, index);

    setKeys((prev) => {
      if (field === "term") return { ...prev, term: "" };

      return { ...prev, definition: "" };
    });
  };

  return (
    <Card key={field.id} className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Card {index + 1}</span>
          {length > 1 && (
            <RemoveCard
              keys={keys}
              isEmpty={isEmpty}
              remove={() => remove(index)}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <FormField
          control={control}
          name={`cards.${index}.term`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <FormControl>
                <Input placeholder="Enter term" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`cards.${index}.termUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term Image (optional)</FormLabel>
              {!!field.value ? (
                <RemoveImage
                  id={keys.term}
                  alt="Term Image"
                  url={field.value}
                  reset={resetImage}
                />
              ) : (
                <FormControl>
                  <UploadDropzone
                    config={{ mode: "auto" }}
                    endpoint="imageUploader"
                    onClientUploadComplete={([data]) => {
                      if (!data) return console.log("No data");

                      field.onChange(data.ufsUrl);
                      addKey("term", data.key, index);
                      setKeys((prev) => ({ ...prev, term: data.key }));
                    }}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`cards.${index}.definition`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter definition" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`cards.${index}.definitionUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition Image (optional)</FormLabel>
              {!!field.value ? (
                <RemoveImage
                  id={keys.definition}
                  url={field.value}
                  alt="Definition Image"
                  reset={resetImage}
                />
              ) : (
                <FormControl>
                  <UploadDropzone
                    endpoint="imageUploader"
                    config={{ mode: "auto" }}
                    onClientUploadComplete={([data]) => {
                      if (!data) return console.log("No data");

                      field.onChange(data.ufsUrl);
                      addKey("definition", data.key, index);
                      setKeys((prev) => ({ ...prev, definition: data.key }));
                    }}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

type AddCardProps = {
  append: () => void;
  className?: string;
};

const AddCard = ({ append, className }: AddCardProps) => (
  <Button
    size="sm"
    type="button"
    variant="outline"
    onClick={append}
    className={className}
  >
    <Plus className="mr-2 h-4 w-4" />
    Add Card
  </Button>
);

type RemoveCardProps = {
  keys: { term: string; definition: string };
  isEmpty: boolean;
  remove: () => void;
};

const RemoveCard = (props: RemoveCardProps) => {
  if (props.isEmpty)
    return (
      <Button
        size="sm"
        type="button"
        variant="ghost"
        onClick={props.remove}
        className="hover size-8 p-0 hover:text-destructive"
      >
        <Trash2 className="size-5" />
        <span className="sr-only">Remove card</span>
      </Button>
    );

  return <RemoveCardDialog {...props} />;
};

const RemoveCardDialog = ({ keys, remove }: RemoveCardProps) => {
  const [open, onOpenChange] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const toRemove: string[] = [];

      Object.entries(keys).forEach(([key, value]) => {
        if (key !== "") toRemove.push(value);
      });

      return deleteFiles(toRemove);
    },
    onSettled: () => {
      remove();
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          type="button"
          variant="ghost"
          className="hover hover:textj-destructive size-8 p-0"
        >
          <Trash2 className="size-5" />
          <span className="sr-only">Remove card</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Card</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this card? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            onClick={mutate}
            className="min-w-32"
            variant="destructive"
          >
            {isPending ? <LoadingSpinner /> : "Delete Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type RemoveImageProps = {
  id: string;
  url: string;
  alt: "Term Image" | "Definition Image";
  reset: (field: "term" | "definition") => void;
};

const RemoveImage = ({ id, url, alt, reset }: RemoveImageProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFiles,
    onSettled: () => {
      reset(alt === "Term Image" ? "term" : "definition");
    },
  });

  if (isPending) return null;

  return (
    <div className="relative">
      <Button
        size="icon"
        type="button"
        variant="outline"
        onClick={() => mutate([id])}
        className="absolute right-2 top-2 size-7 rounded-full"
      >
        <X className="size-5" />
      </Button>
      <Image
        src={url}
        alt={alt}
        width={200}
        height={200}
        className="h-full w-full rounded-md object-fill"
      />
    </div>
  );
};
