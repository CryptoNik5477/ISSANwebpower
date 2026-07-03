import { getTranslations } from "next-intl/server";
import { Card, SectionHeading } from "@/components/ui/card";
import { Repeat, BrainCircuit, Flame } from "lucide-react";

const points = [
  { key: "spaced", Icon: Repeat },
  { key: "active", Icon: BrainCircuit },
  { key: "habit", Icon: Flame },
] as const;

export async function Method() {
  const t = await getTranslations("method");

  return (
    <section id="method" className="scroll-mt-20 border-y border-white/5 bg-night-900/40 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-5 lg:grid-cols-3">
          {points.map(({ key, Icon }, i) => (
            <Card key={key} className="relative overflow-hidden">
              <span className="absolute -right-3 -top-5 font-display text-8xl font-extrabold text-white/5">{i + 1}</span>
              <div className="mb-4 inline-flex rounded-xl border border-jade-500/20 bg-jade-500/10 p-3 text-jade-400">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-night-300">{t(`${key}.description`)}</p>
            </Card>
          ))}
        </div>
        <figure className="mx-auto mt-14 max-w-2xl text-center">
          <blockquote className="font-display text-xl italic text-night-200">{t("quote")}</blockquote>
          <figcaption className="mt-3 text-sm text-gold-400">— {t("quoteAuthor")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
