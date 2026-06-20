import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "gold";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:brightness-[1.08]",
  gold: "bg-gold text-gold-foreground shadow-gold hover:-translate-y-0.5 hover:brightness-[1.05]",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  outline:
    "border border-primary/25 bg-card/60 text-primary hover:border-primary/50 hover:bg-card",
  ghost: "bg-transparent text-foreground hover:bg-secondary/60"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
