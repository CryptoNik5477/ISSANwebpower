import { getTranslations } from "next-intl/server";
import { Card, SectionHeading } from "@/components/ui/card";
import {
  CalendarCheck, Gamepad2, Volume2, Video, PenLine, TrendingUp, Award, Bot, Smartphone,
} from "lucide-react";

const items = [
  { key: "daily", Icon: CalendarCheck },
  { key: "interactive", Icon: Gamepad2 },
  { key: "audio", Icon: Volume2 },
  { key: "video", Icon: Video },
  { key: "reading", Icon: PenLine },
  { key: "progress", Icon: TrendingUp },
  { key: "certificates", Icon: Award },
  { key: "ai", Icon: Bot },
  { key: "mobile", Icon: Smartphone },
] as const;

export async function Features() {
  const t = await getTranslations("features");

  return (
    <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ key, Icon }) => (
          <Card key={key} className="group transition duration-300 hover:-translate-y-1 hover:border-gold-400/30">
            <div className="mb-4 inline-flex rounded-xl border border-gold-400/20 bg-gold-400/10 p-3 text-gold-300 transition group-hover:bg-gold-400/20">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-white">{t(`${key}.title`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-night-300">{t(`${key}.description`)}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
