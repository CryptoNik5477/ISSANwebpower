import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Link } from "@/i18n/navigation";
import { currentUser, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lt } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";

export default async function AdminLessonsPage() {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") redirect("/en/dashboard");
  const [t, locale] = await Promise.all([getTranslations("admin"), getLocale()]);

  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      levels: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } }, exam: { select: { id: true } } },
      },
    },
  });

  async function togglePublished(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("lessonId"));
    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (lesson) {
      await prisma.lesson.update({ where: { id }, data: { published: !lesson.published } });
    }
    revalidatePath("/", "layout");
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold text-white">{t("manageCourses")}</h1>
      {courses.map((course) => (
        <section key={course.id}>
          <h2 className="mb-4 font-display text-xl font-semibold text-gradient-gold">{lt(course.title, locale)}</h2>
          <div className="space-y-4">
            {course.levels.map((level) => (
              <Card key={level.id} className="!p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-white">
                    {level.order}. {lt(level.title, locale)}
                  </h3>
                  <Link
                    href={`/admin/lessons/new?levelId=${level.id}`}
                    className={buttonStyles("secondary", "px-3 py-1.5 text-xs")}
                  >
                    <Plus className="h-3.5 w-3.5" /> {t("newLesson")}
                  </Link>
                </div>
                <ul className="space-y-1">
                  {level.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5">
                      <Badge tone="night" className="w-24 justify-center capitalize">{lesson.type.toLowerCase()}</Badge>
                      <span className="flex-1 truncate text-night-200">{lt(lesson.title, locale)}</span>
                      <span className="text-xs text-night-500">{lesson.minutes}min · {lesson.xpReward}XP</span>
                      <form action={togglePublished}>
                        <input type="hidden" name="lessonId" value={lesson.id} />
                        <button
                          type="submit"
                          title={lesson.published ? t("published") : t("unpublished")}
                          className={`rounded-lg p-1.5 ${lesson.published ? "text-jade-400" : "text-night-500"} hover:bg-white/10`}
                        >
                          {lesson.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </form>
                      <Link href={`/admin/lessons/${lesson.id}`} className="rounded-lg p-1.5 text-night-300 hover:bg-white/10 hover:text-white">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
