import { Plus, Sparkles, Trash2 } from "lucide-react";

import { commonZikrs } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ZikrFieldItem = {
  label: string;
  quantity: number;
};

type ZikrFieldProps = {
  items: ZikrFieldItem[];
  canAddRow: boolean;
  onAddRow: () => void;
  onLabelChange: (index: number, value: string) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onRemoveRow: (index: number) => void;
  rowErrors?: Array<string | undefined>;
};

const SUGGESTIONS_ID = "zikr-suggestions";

export function ZikrField({
  items,
  canAddRow,
  onAddRow,
  onLabelChange,
  onQuantityChange,
  onRemoveRow,
  rowErrors
}: ZikrFieldProps) {
  return (
    <div className="space-y-3">
      <datalist id={SUGGESTIONS_ID}>
        {commonZikrs.map((zikr) => (
          <option key={zikr} value={zikr} />
        ))}
      </datalist>

      {items.map((item, index) => {
        const isActive = item.label.trim().length > 0 && item.quantity > 0;

        return (
          <div
            key={`zikr-${index}`}
            className={cn(
              "grid gap-3 rounded-3xl border bg-card/70 p-4 transition duration-200",
              isActive ? "border-gold/50 shadow-soft" : "border-border"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "mt-0.5 rounded-2xl p-2",
                  isActive ? "bg-gold text-gold-foreground" : "bg-secondary text-primary"
                )}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Zikr {index + 1}</p>
                <p className="text-sm text-muted-foreground">
                  Indiquez la formule puis le nombre de fois récité.
                </p>
              </div>
              {items.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-10 rounded-full px-0"
                  onClick={() => onRemoveRow(index)}
                  aria-label={`Supprimer la ligne Zikr ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_148px]">
              <div className="space-y-2">
                <Label htmlFor={`zikr-label-${index}`}>Zikr</Label>
                <Input
                  id={`zikr-label-${index}`}
                  list={SUGGESTIONS_ID}
                  placeholder="Ex : Salatoul Nabi"
                  value={item.label}
                  onChange={(event) => onLabelChange(index, event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`zikr-quantity-${index}`}>Nombre</Label>
                <Input
                  id={`zikr-quantity-${index}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={item.quantity}
                  onChange={(event) => onQuantityChange(index, Number(event.target.value))}
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
        {canAddRow ? "Ajouter un Zikr" : "Nombre maximum de Zikrs atteint"}
      </Button>
    </div>
  );
}
