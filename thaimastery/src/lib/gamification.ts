// Gamification engine: XP, coins, streaks, achievements.
// Pure helpers are exported separately so they can be unit-tested without a DB.

import { prisma } from "./prisma";
import { daysBetween, utcDay } from "./utils";

export const XP = {
  LESSON: 20,
  QUIZ_PERFECT_BONUS: 10,
  EXAM_PASS: 100,
  LEVEL_COMPLETE: 200,
  DAILY_GOAL: 15,
} as const;

export const COINS = {
  LESSON: 5,
  EXAM_PASS: 25,
  LEVEL_COMPLETE: 50,
} as const;

/** Pure streak transition: returns the new streak given the last activity date. */
export function nextStreak(lastActivity: Date | null, streak: number, now = new Date()): number {
  if (!lastActivity) return 1;
  const gap = daysBetween(lastActivity, now);
  if (gap === 0) return Math.max(streak, 1); // already active today
  if (gap === 1) return streak + 1; // consecutive day
  return 1; // streak broken
}

/** XP needed to reach a given level (quadratic curve, level 1 = 0 XP). */
export function xpForLevel(level: number): number {
  return 50 * (level - 1) * level;
}

/** Current user level derived from total XP. */
export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  return level;
}

/**
 * Record learning activity for a user: bumps XP/coins, advances the streak and
 * upserts today's DailyActivity row. Returns the updated user.
 */
export async function recordActivity(
  userId: string,
  { xp = 0, coins = 0, minutes = 0, lessons = 0 }: { xp?: number; coins?: number; minutes?: number; lessons?: number },
) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const streak = nextStreak(user.lastActivityDate, user.streak);
  const today = utcDay();

  const [updated] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xp },
        coins: { increment: coins },
        streak,
        longestStreak: Math.max(user.longestStreak, streak),
        lastActivityDate: new Date(),
      },
    }),
    prisma.dailyActivity.upsert({
      where: { userId_date: { userId, date: today } },
      create: { userId, date: today, xp, minutes, lessonsCompleted: lessons },
      update: {
        xp: { increment: xp },
        minutes: { increment: minutes },
        lessonsCompleted: { increment: lessons },
      },
    }),
  ]);

  await checkAchievements(userId);
  return updated;
}

/** Award any achievements whose conditions are now met. Idempotent. */
export async function checkAchievements(userId: string): Promise<string[]> {
  const [user, lessonsDone, examsPassed, certs, all, mine] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.lessonProgress.count({ where: { userId } }),
    prisma.examAttempt.count({ where: { userId, passed: true } }),
    prisma.certificate.count({ where: { userId } }),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
  ]);
  const owned = new Set(mine.map((m) => m.achievementId));

  const conditions: Record<string, boolean> = {
    FIRST_LESSON: lessonsDone >= 1,
    TEN_LESSONS: lessonsDone >= 10,
    FIFTY_LESSONS: lessonsDone >= 50,
    STREAK_7: user.streak >= 7 || user.longestStreak >= 7,
    STREAK_30: user.streak >= 30 || user.longestStreak >= 30,
    FIRST_EXAM: examsPassed >= 1,
    FIVE_EXAMS: examsPassed >= 5,
    XP_1000: user.xp >= 1000,
    XP_5000: user.xp >= 5000,
    FIRST_CERTIFICATE: certs >= 1,
    BOTH_CERTIFICATES: certs >= 2,
  };

  const earned: string[] = [];
  for (const a of all) {
    if (owned.has(a.id) || !conditions[a.code]) continue;
    await prisma.$transaction([
      prisma.userAchievement.create({ data: { userId, achievementId: a.id } }),
      prisma.user.update({ where: { id: userId }, data: { xp: { increment: a.xp } } }),
    ]);
    earned.push(a.code);
  }
  return earned;
}
