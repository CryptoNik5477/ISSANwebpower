import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/card";
import { Mic, BookOpen, PenLine, Award, ArrowDown } from "lucide-react";

const steps = [
  { key: "speaking", Icon: Mic },
  { key: "reading", Icon: BookOpen },
  { key: "writing", Icon: PenLine },
  { key: "certification", Icon: Award },
] as const;

export async function Roadmap() {
  const t = await getTranslations("roadmap");

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <ol className="space-y-2">
        {steps.map(({ key, Icon }, i) => (
          <li key={key}>
            <div className="glass flex items-center gap-5 p-5 transition hover:border-gold-400/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-night-950">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">{t(`${key}.title`)}</h3>
                <p className="mt-0.5 text-sm text-night-300">{t(`${key}.description`)}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1 text-gold-500/60" aria-hidden>
                <ArrowDown className="h-5 w-5" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
