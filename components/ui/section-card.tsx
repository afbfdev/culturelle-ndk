import { type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  className
}: SectionCardProps) {
  return (
    <Card className={cn("section-fade p-5 sm:p-6", className)}>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
