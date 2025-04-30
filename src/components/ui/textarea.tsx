import * as React from "react";

import { cn } from "~/lib/utils";

function Textarea({
  className,
  ref: _,
  ...props
}: React.ComponentProps<"textarea">) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    adjustHeight(); // Initial height adjustment

    return () => {
      textarea.removeEventListener("input", adjustHeight);
    };
  }, []);

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "aria-invalid:ring-destructive field-sizing-content shadow-xs flex h-auto min-h-32 w-full resize-none overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
