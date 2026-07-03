import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourseState } from "@/lib/progress";
import { lt } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonStyles } from "@/components/ui/button";

export default async function CoursesPage() {
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const [t, locale] = await Promise.all([getTranslations("courses"), getLocale()]);

  const courses = await prisma.course.findMany({ orderBy: { order: "asc" } });
  const states = await Promise.all(courses.map((c) => getCourseState(user.id, c.slug)));

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-white">{t("title")}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {states.map(
          (c) =>
            c && (
              <Card key={c.id} className="flex flex-col gap-4 p-8">
                <div className="text-5xl">{c.kind === "SPEAKING" ? "🗣️" : "✍️"}</div>
                <h2 className="font-display text-2xl font-bold text-white">{lt(c.title, locale)}</h2>
                <p className="text-sm text-night-300">{lt(c.tagline, locale)}</p>
                <p className="text-xs text-night-400">{t("levels", { count: c.levels.length })}</p>
                <ProgressBar value={c.percent} />
                <p className="text-sm text-night-300">{t("progress", { percent: c.percent })}</p>
                <Link href={`/courses/${c.slug}`} className={buttonStyles("primary", "mt-2 w-full py-3")}>
                  {c.percent > 0 ? "→" : "★"} {lt(c.title, locale)}
                </Link>
              </Card>
            ),
        )}
      </div>
    </div>
  );
}
