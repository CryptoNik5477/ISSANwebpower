"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthCard, inputStyles } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    setBusy(false);
    setSent(true);
  }

  return (
    <AuthCard title={t("forgotTitle")} subtitle={t("forgotSubtitle")}>
      {sent ? (
        <p className="rounded-xl border border-jade-500/30 bg-jade-500/10 p-4 text-sm text-jade-400">{t("resetSent")}</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="email" type="email" required placeholder={t("email")} className={inputStyles} autoComplete="email" />
          <Button type="submit" className="w-full py-3" disabled={busy}>
            {busy ? "…" : t("sendResetLink")}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
