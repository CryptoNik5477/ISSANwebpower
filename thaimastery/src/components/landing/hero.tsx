import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Play } from "lucide-react";

const floatingWords = [
  { thai: "สวัสดี", roman: "sà-wàt-dii", pos: "left-[6%] top-[18%]", delay: "0s" },
  { thai: "ขอบคุณ", roman: "khàwp-khun", pos: "right-[8%] top-[24%]", delay: "1.2s" },
  { thai: "อร่อย", roman: "à-ròi", pos: "left-[12%] bottom-[16%]", delay: "2.1s" },
  { thai: "รัก", roman: "rák", pos: "right-[14%] bottom-[22%]", delay: "0.7s" },
];

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6">
      {/* Floating Thai words illustration */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {floatingWords.map((w) => (
          <div
            key={w.thai}
            className={`glass absolute ${w.pos} animate-float px-4 py-2 text-center`}
            style={{ animationDelay: w.delay }}
          >
            <div className="thai text-xl font-semibold text-gold-300">{w.thai}</div>
            <div className="text-xs text-night-300">{w.roman}</div>
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Badge className="animate-fade-up">
          <Sparkles className="h-3.5 w-3.5" /> {t("badge")}
        </Badge>
        <h1 className="mt-6 animate-fade-up font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl" style={{ animationDelay: "0.1s" }}>
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-night-300" style={{ animationDelay: "0.2s" }}>
          {t("subtitle")}
        </p>
        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.3s" }}>
          <Link href="/register" className={buttonStyles("primary", "px-8 py-3.5 text-base")}>
            {t("ctaPrimary")}
          </Link>
          <a href="#method" className={buttonStyles("secondary", "px-8 py-3.5 text-base")}>
            <Play className="h-4 w-4" /> {t("ctaSecondary")}
          </a>
        </div>
        <p className="mt-6 animate-fade-up text-sm text-night-400" style={{ animationDelay: "0.4s" }}>
          {t("promise")}
        </p>

        <dl className="mx-auto mt-16 grid max-w-xl animate-fade-up grid-cols-3 gap-4" style={{ animationDelay: "0.5s" }}>
          {[
            { value: "12,000+", label: t("statLearners") },
            { value: "120+", label: t("statLessons") },
            { value: "4.9★", label: t("statRating") },
          ].map((s) => (
            <div key={s.label} className="glass px-2 py-4">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-2xl font-bold text-gradient-gold">{s.value}</dd>
              <dd className="mt-1 text-xs text-night-300">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
