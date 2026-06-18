import { cn } from "@/lib/utils";

type CheckboxTileProps = {
  checked: boolean;
  label: string;
  onToggle: () => void;
};

export function CheckboxTile({
  checked,
  label,
  onToggle
}: CheckboxTileProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-white/85 text-foreground hover:border-primary/50 hover:bg-secondary/50"
      )}
    >
      {label}
    </button>
  );
}
