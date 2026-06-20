import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-36 w-full rounded-2xl border border-border bg-card/80 px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/80 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/30 sm:text-sm",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
