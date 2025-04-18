"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { getComputedColorValue } from "~/lib/funcs/generate-color";
import { useMutation } from "~/lib/hooks/use-mutation";
import type { Color } from "~/lib/types/color";
import { cn } from "~/lib/utils";
import { changeColor } from "~/server/change-color";
import { colors } from "~/server/db/schema";

const ColorSchema = z.object({
  color: z.enum(colors),
});

type Props = {
  id: string;
  color: Color;
};

export const ChangeColorForm = ({ id, color: initialColor }: Props) => {
  const form = useForm<z.infer<typeof ColorSchema>>({
    defaultValues: { color: initialColor },
    resolver: zodResolver(ColorSchema),
  });

  const currentValue = form.watch("color");

  const { mutate, isPending } = useMutation({
    mutationFn: changeColor,
  });

  const onSubmit = (data: z.infer<typeof ColorSchema>) => {
    mutate({ id, color: data.color });
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-3 gap-2 p-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {colors.map((color) => {
          const isSelected = currentValue === color;

          return (
            <button
              key={color}
              type="submit"
              disabled={isPending}
              style={{
                backgroundColor: getComputedColorValue(color),
              }}
              className={cn(
                "relative flex size-7 items-center justify-center rounded-full",
                currentValue === "white" && "border",
                isSelected && "ring-2 ring-primary ring-offset-1",
              )}
              onClick={() => form.setValue("color", color)}
            >
              <span className="sr-only">{color}</span>

              {isSelected &&
                (isPending ? (
                  <LoadingSpinner
                    className={cn(
                      "size-4",
                      currentValue === "black" && "text-neutral-100",
                    )}
                  />
                ) : (
                  <>
                    <span className="sr-only">checked</span>
                    <Check
                      className={cn(
                        "size-4",
                        color === "black" ||
                          color === "blue" ||
                          color === "purple"
                          ? "text-white"
                          : "text-black",
                      )}
                    />
                  </>
                ))}
            </button>
          );
        })}
      </form>
    </Form>
  );
};
