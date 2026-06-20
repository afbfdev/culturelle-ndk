import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type StepperProps = {
  steps: { id: string; title: string }[];
  current: number;
};

export function Stepper({ steps, current }: StepperProps) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold">
          Étape {current + 1} / {steps.length}
        </p>
        <p className="font-heading text-lg font-semibold text-primary">
          {steps[current].title}
        </p>
      </div>

      <div className="progress-track h-2 w-full rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isActive = index === current;

          return (
            <li key={step.id} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold transition",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  isActive &&
                    "border-gold bg-gold text-gold-foreground shadow-gold",
                  !isDone &&
                    !isActive &&
                    "border-border bg-card text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[0.65rem] font-medium sm:block",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
