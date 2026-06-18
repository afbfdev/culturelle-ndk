import { BookOpenText, Plus, Sparkles, Trash2 } from "lucide-react";

import type { XassidaOption } from "@/lib/data/xassidas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ArrayFieldItem = {
  xassidaId: string;
  quantity: number;
};

type ArrayFieldProps = {
  options: XassidaOption[];
  items: ArrayFieldItem[];
  canAddRow: boolean;
  onAddRow: () => void;
  onChange: (index: number, quantity: number) => void;
  onSelectChange: (index: number, value: string) => void;
  onRemoveRow: (index: number) => void;
  rowErrors?: Array<string | undefined>;
};

export function ArrayField({
  options,
  items,
  canAddRow,
  onAddRow,
  onChange,
  onSelectChange,
  onRemoveRow,
  rowErrors
}: ArrayFieldProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isActive = item.xassidaId.length > 0 && item.quantity > 0;
        const selectedIds = items
          .map((entry, entryIndex) => (entryIndex === index ? "" : entry.xassidaId))
          .filter(Boolean);

        return (
          <div
            key={`${item.xassidaId || "row"}-${index}`}
            className={cn(
              "grid gap-3 rounded-3xl border bg-white/80 p-4 transition duration-200",
              isActive ? "border-primary/40 shadow-soft" : "border-border"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "mt-0.5 rounded-2xl p-2",
                  isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                )}
              >
                {isActive ? <Sparkles className="h-4 w-4" /> : <BookOpenText className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">Xassida {index + 1}</p>
                <p className="text-sm text-muted-foreground">
                  Selectionnez une xassida du catalogue backend puis indiquez la quantite.
                </p>
              </div>
              {items.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-10 rounded-full px-0"
                  onClick={() => onRemoveRow(index)}
                  aria-label={`Supprimer la ligne Xassida ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_148px]">
              <div className="space-y-2">
                <Label htmlFor={`xassida-select-${index}`}>Xassida</Label>
                <Select
                  id={`xassida-select-${index}`}
                  value={item.xassidaId}
                  onChange={(event) => onSelectChange(index, event.target.value)}
                >
                  <option value="">Choisir une Xassida</option>
                  {options.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                      disabled={selectedIds.includes(option.id)}
                    >
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`xassida-quantity-${index}`}>Quantite</Label>
                <Input
                  id={`xassida-quantity-${index}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={item.quantity}
                  onChange={(event) => onChange(index, Number(event.target.value))}
                />
              </div>
            </div>

            {rowErrors?.[index] ? (
              <p className="text-sm text-red-700">{rowErrors[index]}</p>
            ) : null}
          </div>
        );
      })}

      <Button
        type="button"
        variant="secondary"
        className="w-full gap-2"
        onClick={onAddRow}
        disabled={!canAddRow}
      >
        <Plus className="h-4 w-4" />
        {canAddRow ? "Ajouter une Xassida" : "Toutes les Xassida sont deja disponibles"}
      </Button>
    </div>
  );
}
