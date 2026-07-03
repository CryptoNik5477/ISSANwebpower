"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthCard, inputStyles } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      locale,
      referralCode: new URLSearchParams(window.location.search).get("ref") ?? undefined,
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 409) {
      setBusy(false);
      setError(t("emailExists"));
      return;
    }
    if (!res.ok) {
      setBusy(false);
      setError(t("invalidCredentials"));
      return;
    }
    // Auto-login after successful registration.
    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      callbackUrl: `/${locale}/dashboard`,
    });
  }

  return (
    <AuthCard title={t("registerTitle")} subtitle={t("registerSubtitle")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="name" type="text" required minLength={2} placeholder={t("name")} className={inputStyles} autoComplete="name" />
        <input name="email" type="email" required placeholder={t("email")} className={inputStyles} autoComplete="email" />
        <input name="password" type="password" required minLength={8} placeholder={t("password")} className={inputStyles} autoComplete="new-password" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full py-3" disabled={busy}>
          {busy ? "…" : t("register")}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-night-300">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-gold-400 hover:text-gold-300">
          {t("login")}
        </Link>
      </p>
    </AuthCard>
  );
}
