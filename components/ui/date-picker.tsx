import type { InputHTMLAttributes } from "react";

import { CalendarDays } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DatePickerProps = InputHTMLAttributes<HTMLInputElement>;

export function DatePicker({ className, ...props }: DatePickerProps) {
  return (
    <div className="relative">
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/80" />
      <Input type="date" className={cn("pl-10", className)} {...props} />
    </div>
  );
}
