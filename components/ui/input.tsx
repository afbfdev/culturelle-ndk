import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-2xl border border-border bg-card/80 px-4 text-base outline-none transition placeholder:text-muted-foreground/80 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/30 sm:text-sm",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
