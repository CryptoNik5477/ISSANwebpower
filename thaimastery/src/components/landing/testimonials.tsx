import { getTranslations } from "next-intl/server";
import { Card, SectionHeading } from "@/components/ui/card";
import { Star } from "lucide-react";

export async function Testimonials() {
  const t = await getTranslations("testimonials");

  return (
    <section className="border-y border-white/5 bg-night-900/40 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-5 lg:grid-cols-3">
          {(["t1", "t2", "t3"] as const).map((key) => (
            <Card key={key} className="flex flex-col">
              <div className="mb-3 flex gap-0.5 text-gold-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-night-200">“{t(`${key}.text`)}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-night-500 to-night-700 font-semibold text-white">
                  {t(`${key}.name`).charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{t(`${key}.name`)}</span>
                  <span className="block text-xs text-night-400">{t(`${key}.role`)}</span>
                </span>
              </figcaption>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
