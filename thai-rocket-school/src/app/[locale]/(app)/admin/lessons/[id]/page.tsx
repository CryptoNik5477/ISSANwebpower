import { getTranslations } from "next-intl/server";
import { redirect, notFound } from "next/navigation";
import { currentUser, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { LessonFormFields } from "@/components/admin/lesson-form";
import type { LessonType } from "@prisma/client";
import type { Locale } from "@/types/content";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") redirect("/en/dashboard");
  const { id } = await params;
  const t = await getTranslations("admin");

  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) notFound();

  const title = lesson.title as Record<Locale, string>;

  async function updateLesson(formData: FormData) {
    "use server";
    await requireAdmin();
    let content: unknown;
    try {
      content = JSON.parse(String(formData.get("content") || "[]"));
    } catch {
      return; // keep the previous content on invalid JSON
    }
    await prisma.lesson.update({
      where: { id },
      data: {
        type: String(formData.get("type")) as LessonType,
        day: Number(formData.get("day")) || 1,
        minutes: Number(formData.get("minutes")) || 5,
        xpReward: Number(formData.get("xpReward")) || 20,
        published: formData.get("published") === "on",
        title: {
          en: String(formData.get("titleEn")),
          fr: String(formData.get("titleFr")),
          de: String(formData.get("titleDe")),
        },
        content: content as object[],
      },
    });
    redirect("../lessons");
  }

  async function deleteLesson() {
    "use server";
    await requireAdmin();
    await prisma.lesson.delete({ where: { id } });
    redirect("../lessons");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">{t("editLesson")}</h1>
        <form action={deleteLesson}>
          <button type="submit" className={buttonStyles("danger", "px-4 py-2 text-xs")}>
            {t("deleteLesson")}
          </button>
        </form>
      </div>
      <Card>
        <form action={updateLesson}>
          <LessonFormFields
            values={{
              titleEn: title.en,
              titleFr: title.fr,
              titleDe: title.de,
              type: lesson.type,
              minutes: lesson.minutes,
              xpReward: lesson.xpReward,
              day: lesson.day,
              content: JSON.stringify(lesson.content, null, 2),
              published: lesson.published,
            }}
            labels={{
              titleEn: t("lessonTitleEn"),
              titleFr: t("lessonTitleFr"),
              titleDe: t("lessonTitleDe"),
              type: t("lessonType"),
              minutes: t("lessonMinutes"),
              xp: t("lessonXp"),
              content: t("lessonContent"),
              published: t("published"),
              save: t("saveLesson"),
            }}
          />
        </form>
      </Card>
    </div>
  );
}
