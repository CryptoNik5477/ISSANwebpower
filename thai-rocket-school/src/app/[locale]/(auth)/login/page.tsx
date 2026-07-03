"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { AuthCard, inputStyles } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setBusy(false);
    if (res?.error) {
      setError(t("invalidCredentials"));
    } else {
      const callbackUrl = params.get("callbackUrl");
      if (callbackUrl?.startsWith("/")) {
        window.location.href = callbackUrl;
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
  }

  return (
    <AuthCard title={t("loginTitle")} subtitle={t("loginSubtitle")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="email" type="email" required placeholder={t("email")} className={inputStyles} autoComplete="email" />
        <input name="password" type="password" required placeholder={t("password")} className={inputStyles} autoComplete="current-password" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full py-3" disabled={busy}>
          {busy ? "…" : t("login")}
        </Button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-night-300 hover:text-white">
          {t("forgotPassword")}
        </Link>
        <Link href="/register" className="text-gold-400 hover:text-gold-300">
          {t("noAccount")} {t("register")}
        </Link>
      </div>
      <p className="mt-6 border-t border-white/5 pt-4 text-center text-xs text-night-500">
        demo@thairocketschool.com / demo1234! ({locale})
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
