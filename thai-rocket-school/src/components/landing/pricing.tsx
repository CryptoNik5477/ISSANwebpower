"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { PRICING_PLANS } from "@/config/pricing";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const router = useRouter();
  const { status } = useSession();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(plan: string) {
    if (status !== "authenticated") {
      router.push("/register");
      return;
    }
    setBusy(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, locale }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return; // keep the button in its busy state while we navigate away
      }
      setError(t("checkoutError"));
    } catch {
      setError(t("checkoutError"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-6 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`glass relative flex flex-col p-8 transition hover:-translate-y-1 ${
              plan.popular ? "border-gold-400/50 shadow-xl shadow-gold-500/10" : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t("popular")}</Badge>
            )}
            <h3 className="font-display text-lg font-semibold text-white">{t(`plans.${plan.key}.name`)}</h3>
            <p className="mt-1 text-sm text-night-400">{t(`plans.${plan.key}.description`)}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold text-white">
                {formatPrice(plan.amount, locale)}
              </span>
              <span className="text-sm text-night-400">
                {plan.interval === "month" ? t("perMonth") : plan.interval === "year" ? t("perYear") : t("oneTime")}
              </span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {(["f1", "f2", "f3", "f4"] as const).map((f) => (
                <li key={f} className="flex items-start gap-2 text-night-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-jade-400" />
                  {t(`plans.${plan.key}.${f}`)}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.popular ? "primary" : "secondary"}
              className="mt-8 w-full py-3"
              onClick={() => checkout(plan.id)}
              disabled={busy !== null}
            >
              {busy === plan.id ? "…" : t("cta")}
            </Button>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-6 text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="mt-8 text-center text-sm text-night-400">{t("guarantee")}</p>
      {status !== "authenticated" && (
        <p className="mt-2 text-center text-xs text-night-500">{t("loginFirst")}</p>
      )}
    </section>
  );
}
