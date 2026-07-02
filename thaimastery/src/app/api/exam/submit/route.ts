import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourseState } from "@/lib/progress";
import { recordActivity, checkAchievements, XP, COINS } from "@/lib/gamification";
import { examSubmitSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { emails } from "@/lib/email";
import { lt } from "@/lib/utils";
import type { QuizQuestion } from "@/types/content";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const rl = rateLimit(`exam:${userId}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = examSubmitSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { examId, answers } = parsed.data;

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { level: { include: { course: true } } },
  });
  if (!exam) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Level must be unlocked to sit its exam.
  const stateBefore = await getCourseState(userId, exam.level.course.slug);
  const levelState = stateBefore?.levels.find((l) => l.id === exam.levelId);
  if (!levelState?.unlocked) return NextResponse.json({ error: "locked" }, { status: 403 });

  const questions = exam.questions as unknown as QuizQuestion[];
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= exam.passScore;
  const firstPass = passed && !levelState.examPassed;

  await prisma.examAttempt.create({ data: { userId, examId, score, passed } });

  let xp = 0;
  let coins = 0;
  if (firstPass) {
    xp = XP.EXAM_PASS + exam.level.xpReward;
    coins = COINS.EXAM_PASS + COINS.LEVEL_COMPLETE;
  }
  const user = await recordActivity(userId, { xp, coins, minutes: 5 });

  let certificateId: string | undefined;
  if (firstPass) {
    void emails.levelCompleted(user.email, user.name ?? "there", lt(exam.level.title, user.locale));

    // Course finished (all levels' exams passed) → issue the certificate.
    const stateAfter = await getCourseState(userId, exam.level.course.slug);
    const allPassed = stateAfter?.levels.every((l) => l.examPassed) ?? false;
    if (allPassed && !stateAfter?.certificateId) {
      const cert = await prisma.certificate.create({
        data: {
          userId,
          courseId: exam.level.courseId,
          serial: `TM-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`,
        },
      });
      certificateId = cert.id;
      await checkAchievements(userId);
      void emails.certificateEarned(user.email, user.name ?? "there", lt(exam.level.course.title, user.locale), cert.id);
    }
  }

  return NextResponse.json({ score, passed, certificateId });
}
