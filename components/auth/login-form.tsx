"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, LogIn } from "lucide-react";

import { loginAction, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full gap-2" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connexion…
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          Se connecter
        </>
      )}
    </Button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe administrateur</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          autoFocus
        />
      </div>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
