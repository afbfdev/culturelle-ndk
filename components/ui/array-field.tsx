import { BookOpenText, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ArrayFieldItem = {
  name: string;
  quantity: number;
};

type ArrayFieldProps = {
  items: ArrayFieldItem[];
  onChange: (index: number, quantity: number) => void;
};

export function ArrayField({ items, onChange }: ArrayFieldProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isActive = item.quantity > 0;

        return (
          <div
            key={item.name}
            className={cn(
              "grid gap-3 rounded-3xl border bg-white/80 p-4 transition duration-200 md:grid-cols-[1fr_148px]",
              isActive ? "border-primary/40 shadow-soft" : "border-border"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 rounded-2xl p-2",
                  isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                )}
              >
                {isActive ? <Sparkles className="h-4 w-4" /> : <BookOpenText className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Indiquez la quantite recitee pour cette xassida.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`xassida-${index}`}>Quantite</Label>
              <Input
                id={`xassida-${index}`}
                type="number"
                inputMode="numeric"
                min={0}
                value={item.quantity}
                onChange={(event) => onChange(index, Number(event.target.value))}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
