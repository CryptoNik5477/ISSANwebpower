import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLesson } from "@/lib/progress";
import { recordActivity, XP, COINS } from "@/lib/gamification";
import { lessonCompleteSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const rl = rateLimit(`progress:${userId}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = lessonCompleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { lessonId, minutes, score } = parsed.data;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!(await canAccessLesson(userId, lessonId))) {
    return NextResponse.json({ error: "locked" }, { status: 403 });
  }

  const already = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, score },
    update: { score: score ?? undefined, completedAt: new Date() },
  });

  // XP/coins only the first time; streak/minutes always count.
  const xp = already ? 0 : lesson.xpReward || XP.LESSON;
  const coins = already ? 0 : COINS.LESSON;
  const user = await recordActivity(userId, { xp, coins, minutes, lessons: already ? 0 : 1 });

  return NextResponse.json({ ok: true, xp, coins, streak: user.streak });
}
