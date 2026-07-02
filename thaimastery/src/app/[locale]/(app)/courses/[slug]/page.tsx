import { getTranslations, getLocale } from "next-intl/server";
import { redirect, notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourseState } from "@/lib/progress";
import { lt } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Lock, CheckCircle2, Circle, GraduationCap, Award } from "lucide-react";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const [t, locale] = await Promise.all([getTranslations("courses"), getLocale()]);

  const state = await getCourseState(user.id, slug);
  if (!state) notFound();

  // Lessons per level for the expanded (active) levels.
  const lessons = await prisma.lesson.findMany({
    where: { levelId: { in: state.levels.map((l) => l.id) }, published: true },
    orderBy: { order: "asc" },
    select: { id: true, levelId: true, title: true, type: true, minutes: true, day: true },
  });
  const done = new Set(
    (
      await prisma.lessonProgress.findMany({
        where: { userId: user.id, lessonId: { in: lessons.map((l) => l.id) } },
        select: { lessonId: true },
      })
    ).map((p) => p.lessonId),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">{lt(state.title, locale)}</h1>
        <p className="mt-1 text-night-300">{lt(state.tagline, locale)}</p>
        <div className="mt-4 flex items-center gap-4">
          <ProgressBar value={state.percent} className="flex-1" />
          <span className="text-sm text-night-300">{state.percent}%</span>
        </div>
        {state.certificateId && (
          <Link href="/certificates" className={buttonStyles("secondary", "mt-4")}>
            <Award className="h-4 w-4 text-gold-400" /> {t("certificate")}
          </Link>
        )}
      </div>

      <ol className="space-y-4">
        {state.levels.map((level) => {
          const levelLessons = lessons.filter((l) => l.levelId === level.id);
          const allLessonsDone = level.lessonsDone === level.lessonCount;
          const isActive = level.unlocked && !level.completed;
          return (
            <li key={level.id}>
              <Card className={`${!level.unlocked ? "opacity-60" : ""} ${isActive ? "border-gold-400/40" : ""}`}>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold ${
                      level.completed
                        ? "bg-jade-500/20 text-jade-400"
                        : level.unlocked
                          ? "bg-gradient-to-br from-gold-400 to-gold-600 text-night-950"
                          : "bg-white/5 text-night-500"
                    }`}
                  >
                    {level.completed ? <CheckCircle2 className="h-6 w-6" /> : level.unlocked ? level.order : <Lock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-semibold text-white">
                      {level.order}. {lt(level.title, locale)}
                    </h2>
                    <p className="text-sm text-night-400">{lt(level.description, locale)}</p>
                  </div>
                  <div className="text-right text-xs text-night-400">
                    {t("lessonsInLevel", { done: level.lessonsDone, total: level.lessonCount })}
                    {level.examPassed && level.bestExamScore !== null && (
                      <div className="mt-1">
                        <Badge tone="jade">{t("examPassed", { score: level.bestExamScore })}</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {!level.unlocked && <p className="mt-3 text-xs text-night-500">{t("examRequired")}</p>}

                {level.unlocked && (
                  <div className="mt-4 space-y-1.5 border-t border-white/5 pt-4">
                    {levelLessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/learn/${lesson.id}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
                      >
                        {done.has(lesson.id) ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-jade-400" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-night-500" />
                        )}
                        <span className="flex-1 text-night-200">{lt(lesson.title, locale)}</span>
                        <span className="text-xs text-night-500">{lesson.minutes} min</span>
                      </Link>
                    ))}
                    {level.examId && (
                      <div className="pt-2">
                        {allLessonsDone ? (
                          <Link href={`/exam/${level.examId}`} className={buttonStyles(level.examPassed ? "secondary" : "primary", "w-full py-2.5")}>
                            <GraduationCap className="h-4 w-4" />
                            {level.examPassed ? t("examPassed", { score: level.bestExamScore ?? 0 }) : t("takeExam")}
                          </Link>
                        ) : (
                          <p className="rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-night-400">{t("examLockedHint")}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
