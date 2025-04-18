import { Loader } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

type Props = ComponentProps<"svg">;

export const LoadingSpinner = ({ className, ...props }: Props) => (
  <Loader
    {...props}
    className={cn(
      "size-5 animate-[spin_1.25s_linear_infinite] text-black",
      className,
    )}
  />
);
