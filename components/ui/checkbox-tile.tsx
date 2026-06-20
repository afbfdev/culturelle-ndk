import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckboxTileProps = {
  checked: boolean;
  label: string;
  hint?: string;
  onToggle: () => void;
};

export function CheckboxTile({
  checked,
  label,
  hint,
  onToggle
}: CheckboxTileProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={cn(
        "group relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-center transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
        checked
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card/70 text-foreground hover:border-gold/60 hover:bg-secondary/40"
      )}
    >
      {checked ? (
        <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-gold-foreground">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      ) : null}
      {hint ? (
        <span
          className={cn(
            "text-[0.6rem] uppercase tracking-[0.18em]",
            checked ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {hint}
        </span>
      ) : null}
      <span className="font-heading text-2xl font-semibold leading-none">
        {label}
      </span>
    </button>
  );
}
