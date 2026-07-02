import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { utcDay, formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Users, BookOpenCheck, GraduationCap, Activity, Library, Image as ImageIcon, CreditCard } from "lucide-react";

export default async function AdminPage() {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") redirect("/en/dashboard");
  const t = await getTranslations("admin");

  const [students, activeToday, lessonsCompleted, examAttempts, payments, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.dailyActivity.count({ where: { date: utcDay() } }),
    prisma.lessonProgress.count(),
    prisma.examAttempt.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, name: true, email: true, plan: true, createdAt: true } }),
  ]);

  const stats = [
    { Icon: Users, label: t("students"), value: students },
    { Icon: Activity, label: t("activeToday"), value: activeToday },
    { Icon: BookOpenCheck, label: t("lessonsCompleted"), value: lessonsCompleted },
    { Icon: GraduationCap, label: t("examAttempts"), value: examAttempts },
    { Icon: CreditCard, label: t("revenue"), value: `${formatPrice(payments._sum.amount ?? 0, "en")} (${payments._count})` },
  ];

  const sections = [
    { href: "/admin/lessons", label: t("manageCourses"), Icon: Library },
    { href: "/admin/users", label: t("manageUsers"), Icon: Users },
    { href: "/admin/media", label: t("manageMedia"), Icon: ImageIcon },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold text-white">{t("title")}</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(({ Icon, label, value }) => (
          <Card key={label} className="!p-5">
            <Icon className="h-6 w-6 text-gold-400" />
            <div className="mt-3 font-display text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-night-400">{label}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className="glass flex items-center gap-4 p-6 transition hover:border-gold-400/40">
            <Icon className="h-8 w-8 text-gold-400" />
            <span className="font-display font-semibold text-white">{label}</span>
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">{t("students")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="py-2.5 pr-4 text-white">{u.name}</td>
                  <td className="py-2.5 pr-4 text-night-300">{u.email}</td>
                  <td className="py-2.5 pr-4 text-night-400">{u.plan}</td>
                  <td className="py-2.5 text-right text-xs text-night-500">{u.createdAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
