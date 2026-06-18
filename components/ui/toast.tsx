import { CheckCircle2, CircleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastProps = {
  kind: "success" | "error";
  message: string;
  onClose: () => void;
};

export function Toast({ kind, message, onClose }: ToastProps) {
  const isSuccess = kind === "success";

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-start gap-3 rounded-3xl border p-4 shadow-soft backdrop-blur section-fade",
        isSuccess
          ? "border-primary/25 bg-white/95 text-foreground"
          : "border-red-200 bg-red-50/95 text-red-900"
      )}
    >
      <div
        className={cn(
          "rounded-2xl p-2",
          isSuccess ? "bg-primary text-primary-foreground" : "bg-red-100 text-red-700"
        )}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <CircleAlert className="h-4 w-4" />
        )}
      </div>
      <p className="flex-1 text-sm leading-6">{message}</p>
      <Button
        variant="ghost"
        className="h-8 w-8 rounded-full px-0"
        onClick={onClose}
        aria-label="Fermer la notification"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
