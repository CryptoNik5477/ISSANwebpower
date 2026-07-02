import { getLocale, getTranslations } from "next-intl/server";
import { redirect, notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLesson } from "@/lib/progress";
import { lt } from "@/lib/utils";
import type { ContentBlock } from "@/types/content";
import { ContentBlocks } from "@/components/learn/content-blocks";
import { CompleteLessonButton } from "@/components/learn/complete-lesson-button";
import { AiTutor } from "@/components/learn/ai-tutor";
import { AiWriting } from "@/components/learn/ai-writing";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const [locale, tc] = await Promise.all([getLocale(), getTranslations("common")]);

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { level: { include: { course: true } } },
  });
  if (!lesson || !lesson.published) notFound();

  const allowed = await canAccessLesson(user.id, lessonId);
  const courseSlug = lesson.level.course.slug;
  if (!allowed) redirect(`/${locale}/courses/${courseSlug}`);

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } },
  });

  const blocks = lesson.content as unknown as ContentBlock[];
  const isSpeakingCourse = lesson.level.course.kind === "SPEAKING";
  const showAiTutor = isSpeakingCourse && (lesson.type === "SPEAKING" || lesson.type === "LESSON");
  const showAiWriting = !isSpeakingCourse && (lesson.type === "WRITING" || lesson.type === "LESSON");

  return (
    <article className="mx-auto max-w-2xl">
      <Link href={`/courses/${courseSlug}`} className="mb-6 inline-flex items-center gap-2 text-sm text-night-300 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {lt(lesson.level.title, locale)}
      </Link>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="w-full font-display text-2xl font-bold text-white sm:w-auto sm:flex-1">
          {lt(lesson.title, locale)}
        </h1>
        <Badge tone="night" className="capitalize">{lesson.type.toLowerCase()}</Badge>
        <Badge tone="night">{tc("minutes", { count: lesson.minutes })}</Badge>
        <Badge>{`+${lesson.xpReward} XP`}</Badge>
      </div>

      <ContentBlocks blocks={blocks} />

      {showAiTutor && (
        <div className="mt-10">
          <AiTutor scenario={lt(lesson.level.title, "en")} />
        </div>
      )}
      {showAiWriting && (
        <div className="mt-10">
          <AiWriting />
        </div>
      )}

      <div className="mt-10">
        <CompleteLessonButton
          lessonId={lesson.id}
          minutes={lesson.minutes}
          xp={lesson.xpReward}
          done={Boolean(progress)}
          courseSlug={courseSlug}
        />
      </div>
    </article>
  );
}
