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
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {options.map((value) => (
        <CheckboxTile
          key={value}
          checked={selectedValues.includes(value)}
          label={`Kamil ${value}`}
          onToggle={() => onToggle(value)}
        />
      ))}
    </div>
  );
}
