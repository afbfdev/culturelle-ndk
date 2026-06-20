import { CheckboxTile } from "@/components/ui/checkbox-tile";

type CheckboxGridProps = {
  options: number[];
  selectedValues: number[];
  onToggle: (value: number) => void;
};

export function CheckboxGrid({
  options,
  selectedValues,
  onToggle
}: CheckboxGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 sm:gap-3">
      {options.map((value) => (
        <CheckboxTile
          key={value}
          checked={selectedValues.includes(value)}
          label={String(value)}
          hint="Jukki"
          onToggle={() => onToggle(value)}
        />
      ))}
    </div>
  );
}
