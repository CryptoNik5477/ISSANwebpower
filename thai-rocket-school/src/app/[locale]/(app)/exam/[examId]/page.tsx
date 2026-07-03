import { getLocale, getTranslations } from "next-intl/server";
import { redirect, notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourseState } from "@/lib/progress";
import { lt } from "@/lib/utils";
import type { QuizQuestion } from "@/types/content";
import { ExamRunner } from "@/components/learn/exam-runner";
import { ArrowLeft } from "lucide-react";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const [locale, t] = await Promise.all([getLocale(), getTranslations("exam")]);

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { level: { include: { course: true } } },
  });
  if (!exam) notFound();

  const courseSlug = exam.level.course.slug;
  const state = await getCourseState(user.id, courseSlug);
  const levelState = state?.levels.find((l) => l.id === exam.levelId);
  if (!levelState?.unlocked) redirect(`/${locale}/courses/${courseSlug}`);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/courses/${courseSlug}`} className="mb-6 inline-flex items-center gap-2 text-sm text-night-300 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {lt(exam.level.title, locale)}
      </Link>
      <h1 className="mb-2 font-display text-2xl font-bold text-white">{lt(exam.title, locale)}</h1>
      <p className="mb-8 text-sm text-night-400">{t("title")} · {lt(state!.title, locale)}</p>
      <ExamRunner
        examId={exam.id}
        passScore={exam.passScore}
        questions={exam.questions as unknown as QuizQuestion[]}
        courseSlug={courseSlug}
      />
    </div>
  );
}
