import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { currentUser, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { inputStyles } from "@/components/auth/auth-card";
import { Shield, Award } from "lucide-react";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const me = await currentUser();
  if (!me || me.role !== "ADMIN") redirect("/en/dashboard");
  const { q } = await searchParams;
  const t = await getTranslations("admin");

  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { certificates: { select: { id: true } } },
  });
  const courses = await prisma.course.findMany({ orderBy: { order: "asc" } });

  async function toggleRole(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("userId"));
    if (id === admin.id) return; // don't demote yourself
    const target = await prisma.user.findUnique({ where: { id } });
    if (target) {
      await prisma.user.update({
        where: { id },
        data: { role: target.role === "ADMIN" ? "STUDENT" : "ADMIN" },
      });
    }
    revalidatePath("/", "layout");
  }

  async function issueCertificate(formData: FormData) {
    "use server";
    await requireAdmin();
    const userId = String(formData.get("userId"));
    const courseId = String(formData.get("courseId"));
    const exists = await prisma.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } });
    if (!exists) {
      await prisma.certificate.create({
        data: {
          userId,
          courseId,
          serial: `TRS-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`,
        },
      });
    }
    revalidatePath("/", "layout");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-white">
          {t("manageUsers")} <span className="text-base font-normal text-night-400">({users.length} {t("users")})</span>
        </h1>
        <form className="w-full sm:w-64">
          <input name="q" defaultValue={q} placeholder={t("search")} className={inputStyles} />
        </form>
      </div>

      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 text-white">{u.name ?? "—"}</td>
                  <td className="px-2 py-3 text-night-300">{u.email}</td>
                  <td className="px-2 py-3">
                    <Badge tone={u.role === "ADMIN" ? "gold" : "night"}>{u.role}</Badge>
                  </td>
                  <td className="px-2 py-3">
                    <Badge tone={u.plan === "FREE" ? "night" : "jade"}>{u.plan}</Badge>
                  </td>
                  <td className="px-2 py-3 text-xs text-night-400">{u.xp} XP · 🔥{u.streak}</td>
                  <td className="px-2 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={issueCertificate} className="flex items-center gap-1">
                        <input type="hidden" name="userId" value={u.id} />
                        <select name="courseId" className="rounded-lg border border-white/10 bg-night-900 px-2 py-1 text-xs text-night-200">
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {(c.title as { en: string }).en}
                            </option>
                          ))}
                        </select>
                        <button type="submit" title={t("issueCertificate")} className="rounded-lg p-1.5 text-jade-400 hover:bg-white/10">
                          <Award className="h-4 w-4" />
                        </button>
                      </form>
                      <form action={toggleRole}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button
                          type="submit"
                          title={u.role === "ADMIN" ? t("makeStudent") : t("makeAdmin")}
                          className={`rounded-lg p-1.5 hover:bg-white/10 ${u.role === "ADMIN" ? "text-gold-400" : "text-night-500"}`}
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
