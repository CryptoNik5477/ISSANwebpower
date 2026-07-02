import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDailyPlan, getCourseState } from "@/lib/progress";
import { levelFromXp } from "@/lib/gamification";
import { lt, utcDay } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Flame, Star, CircleDollarSign, BookOpenCheck, CheckCircle2, Circle, Award } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const [t, locale] = await Promise.all([getTranslations("dashboard"), getLocale()]);

  const [plan, lessonsDone, achievements, myAchievements, activity, courses] = await Promise.all([
    getDailyPlan(user.id),
    prisma.lessonProgress.count({ where: { userId: user.id } }),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId: user.id } }),
    prisma.dailyActivity.findMany({
      where: { userId: user.id, date: { gte: new Date(Date.now() - 27 * 86_400_000) } },
    }),
    prisma.course.findMany({ orderBy: { order: "asc" }, select: { slug: true } }),
  ]);

  const states = (await Promise.all(courses.map((c) => getCourseState(user.id, c.slug)))).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  const earned = new Set(myAchievements.map((a) => a.achievementId));
  const todayActivity = activity.find((a) => utcDay(a.date).getTime() === utcDay().getTime());
  const minutesToday = todayActivity?.minutes ?? 0;
  const planMinutes = plan.reduce((n, p) => n + p.minutes, 0);
  const level = levelFromXp(user.xp);

  const stats = [
    { Icon: Flame, label: t("streak"), value: user.streak, accent: "text-orange-400" },
    { Icon: Star, label: t("totalXp"), value: user.xp, accent: "text-gold-400" },
    { Icon: CircleDollarSign, label: t("coins"), value: user.coins, accent: "text-jade-400" },
    { Icon: BookOpenCheck, label: t("lessonsDone"), value: lessonsDone, accent: "text-sky-400" },
  ];

  // 28-day calendar grid.
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = utcDay(new Date(Date.now() - (27 - i) * 86_400_000));
    const a = activity.find((x) => utcDay(x.date).getTime() === d.getTime());
    return { date: d, minutes: a?.minutes ?? 0 };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            {t("greeting", { name: user.name?.split(" ")[0] ?? "friend" })}
          </h1>
          <p className="mt-1 text-night-300">{t("subtitle", { minutes: planMinutes || user.dailyGoalMinutes })}</p>
        </div>
        <Badge tone="night">Level {level}</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ Icon, label, value, accent }) => (
          <Card key={label} className="flex items-center gap-4 !p-5">
            <Icon className={`h-8 w-8 ${accent}`} />
            <div>
              <div className="font-display text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-night-400">{label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's plan */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">{t("todayPlan")}</h2>
            <Badge tone={minutesToday >= user.dailyGoalMinutes ? "jade" : "gold"}>
              {minutesToday >= user.dailyGoalMinutes ? t("dailyGoalDone") : `${t("dailyGoal")} ${minutesToday}/${user.dailyGoalMinutes} min`}
            </Badge>
          </div>
          {plan.length === 0 ? (
            <p className="py-8 text-center text-night-300">{t("allDone")}</p>
          ) : (
            <ul className="space-y-2">
              {plan.map((item) => (
                <li key={item.lessonId}>
                  <Link
                    href={`/learn/${item.lessonId}`}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 transition hover:border-gold-400/30 hover:bg-white/[0.06]"
                  >
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-jade-400" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-night-500" />
                    )}
                    <span className="flex-1 text-sm text-white">{lt(item.title, locale)}</span>
                    <Badge tone="night" className="capitalize">{item.type.toLowerCase()}</Badge>
                    <span className="text-xs text-night-400">{item.minutes} min</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Activity calendar */}
        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold text-white">{t("activityCalendar")}</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => (
              <div
                key={d.date.toISOString()}
                title={`${d.date.toISOString().slice(0, 10)} · ${d.minutes} min`}
                className={`aspect-square rounded-md ${
                  d.minutes >= 15 ? "bg-jade-500" : d.minutes > 0 ? "bg-jade-500/40" : "bg-white/5"
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-night-400">
            {t("streak")}: <span className="font-semibold text-orange-400">{user.streak} 🔥</span>
          </p>
        </Card>
      </div>

      {/* Courses */}
      <section>
        <h2 className="mb-4 font-display text-xl font-semibold text-white">{t("yourCourses")}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {states.map((c) => (
            <Card key={c.id} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{lt(c.title, locale)}</h3>
                  <p className="mt-0.5 text-sm text-night-400">{lt(c.tagline, locale)}</p>
                </div>
                {c.certificateId && (
                  <Badge tone="jade">
                    <Award className="h-3.5 w-3.5" /> {t("certificateReady")}
                  </Badge>
                )}
              </div>
              <ProgressBar value={c.percent} />
              <div className="flex items-center justify-between">
                <span className="text-sm text-night-300">{c.percent}%</span>
                <Link href={`/courses/${c.slug}`} className={buttonStyles("secondary", "px-4 py-2 text-xs")}>
                  {t("viewCourse")}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="mb-4 font-display text-xl font-semibold text-white">{t("achievements")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {achievements.map((a) => {
            const owned = earned.has(a.id);
            return (
              <Card
                key={a.id}
                className={`!p-4 text-center ${owned ? "border-gold-400/40" : "opacity-40 grayscale"}`}
                title={lt(a.description, locale)}
              >
                <div className="text-3xl">{a.icon}</div>
                <div className="mt-2 text-xs font-medium text-white">{lt(a.title, locale)}</div>
                <div className="mt-1 text-[10px] text-night-400">+{a.xp} XP</div>
              </Card>
            );
          })}
        </div>
        {earned.size === 0 && <p className="mt-3 text-sm text-night-400">{t("achievementsEmpty")}</p>}
      </section>
    </div>
  );
}
