"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthCard, inputStyles } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

function ResetForm() {
  const t = useTranslations("auth");
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: form.get("password") }),
    });
    setState(res.ok ? "done" : "error");
  }

  return (
    <AuthCard title={t("resetTitle")} subtitle="">
      {state === "done" ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-jade-500/30 bg-jade-500/10 p-4 text-sm text-jade-400">{t("resetSuccess")}</p>
          <Link href="/login" className="block text-center text-sm text-gold-400 hover:text-gold-300">
            {t("login")}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="password" type="password" required minLength={8} placeholder={t("newPassword")} className={inputStyles} autoComplete="new-password" />
          {state === "error" && <p className="text-sm text-red-400">{t("resetInvalid")}</p>}
          <Button type="submit" className="w-full py-3" disabled={state === "busy"}>
            {state === "busy" ? "…" : t("resetPassword")}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
