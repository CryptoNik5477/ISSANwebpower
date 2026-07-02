import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { currentUser, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { LessonFormFields } from "@/components/admin/lesson-form";
import type { LessonType } from "@prisma/client";

export default async function NewLessonPage({
  searchParams,
}: {
  searchParams: Promise<{ levelId?: string }>;
}) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") redirect("/en/dashboard");
  const { levelId } = await searchParams;
  if (!levelId) redirect("/en/admin/lessons");
  const t = await getTranslations("admin");

  async function createLesson(formData: FormData) {
    "use server";
    await requireAdmin();
    const lid = String(formData.get("levelId"));
    const maxOrder = await prisma.lesson.aggregate({ where: { levelId: lid }, _max: { order: true } });
    let content: unknown = [];
    try {
      content = JSON.parse(String(formData.get("content") || "[]"));
    } catch {
      content = [{ type: "text", body: { en: String(formData.get("content")), fr: "", de: "" } }];
    }
    await prisma.lesson.create({
      data: {
        levelId: lid,
        order: (maxOrder._max.order ?? 0) + 1,
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

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-white">{t("newLesson")}</h1>
      <Card>
        <form action={createLesson}>
          <input type="hidden" name="levelId" value={levelId} />
          <LessonFormFields
            values={{ content: '[\n  { "type": "text", "body": { "en": "", "fr": "", "de": "" } }\n]' }}
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
