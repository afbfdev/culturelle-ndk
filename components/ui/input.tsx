import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-xl border bg-white/90 px-4 text-sm outline-none transition placeholder:text-muted-foreground/90 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
