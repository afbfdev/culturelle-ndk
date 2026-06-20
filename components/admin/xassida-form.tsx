"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Plus } from "lucide-react";

import {
  createXassidaAction,
  type CreateXassidaState
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

const initialState: CreateXassidaState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="gold" className="w-full gap-2" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enregistrement…
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Enregistrer la Xassida
        </>
      )}
    </Button>
  );
}

export function XassidaForm() {
  const [state, formAction] = useFormState(createXassidaAction, initialState);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "idle") {
      return;
    }

    setToast({
      kind: state.status === "success" ? "success" : "error",
      message:
        state.message ??
        (state.status === "success"
          ? "Xassida enregistrée."
          : "L'enregistrement a échoué.")
    });

    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <form ref={formRef} action={formAction} className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Titre de la Xassida</Label>
          <Input id="label" name="label" placeholder="Ex : Hizbul Falah" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnelle)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Contexte ou précision utile."
            className="min-h-24"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Ordre d&apos;affichage</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} />
        </div>
        <SubmitButton />
      </form>

      {toast ? (
        <Toast kind={toast.kind} message={toast.message} onClose={() => setToast(null)} />
      ) : null}
    </>
  );
}
