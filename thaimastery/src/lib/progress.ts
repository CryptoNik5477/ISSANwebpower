// Course progression: level locking, per-course progress, the daily plan.

import { prisma } from "./prisma";
import { utcDay } from "./utils";

export interface LevelState {
  id: string;
  order: number;
  slug: string;
  title: unknown;
  description: unknown;
  xpReward: number;
  lessonCount: number;
  lessonsDone: number;
  examId: string | null;
  examPassed: boolean;
  bestExamScore: number | null;
  unlocked: boolean;
  completed: boolean;
}

export interface CourseState {
  id: string;
  kind: string;
  slug: string;
  title: unknown;
  tagline: unknown;
  levels: LevelState[];
  percent: number;
  certificateId: string | null;
}

/**
 * Level N is unlocked when every previous level's exam has been passed (≥ pass
 * score). Level 1 is always unlocked. A level is completed when all its
 * lessons are done AND its exam is passed.
 */
export async function getCourseState(userId: string, courseSlug: string): Promise<CourseState | null> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      levels: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          lessons: { where: { published: true }, select: { id: true } },
          exam: { select: { id: true } },
        },
      },
    },
  });
  if (!course) return null;

  const lessonIds = course.levels.flatMap((l) => l.lessons.map((x) => x.id));
  const examIds = course.levels.map((l) => l.exam?.id).filter(Boolean) as string[];

  const [progress, attempts, certificate] = await Promise.all([
    prisma.lessonProgress.findMany({ where: { userId, lessonId: { in: lessonIds } }, select: { lessonId: true } }),
    prisma.examAttempt.findMany({ where: { userId, examId: { in: examIds } }, select: { examId: true, score: true, passed: true } }),
    prisma.certificate.findUnique({ where: { userId_courseId: { userId, courseId: course.id } }, select: { id: true } }),
  ]);
  const doneLessons = new Set(progress.map((p) => p.lessonId));

  let previousPassed = true; // level 1 gate
  const levels: LevelState[] = course.levels.map((level) => {
    const levelAttempts = attempts.filter((a) => a.examId === level.exam?.id);
    const examPassed = levelAttempts.some((a) => a.passed);
    const bestExamScore = levelAttempts.length ? Math.max(...levelAttempts.map((a) => a.score)) : null;
    const lessonsDone = level.lessons.filter((l) => doneLessons.has(l.id)).length;
    const unlocked = previousPassed;
    const completed = examPassed && lessonsDone === level.lessons.length;
    previousPassed = previousPassed && examPassed;
    return {
      id: level.id,
      order: level.order,
      slug: level.slug,
      title: level.title,
      description: level.description,
      xpReward: level.xpReward,
      lessonCount: level.lessons.length,
      lessonsDone,
      examId: level.exam?.id ?? null,
      examPassed,
      bestExamScore,
      unlocked,
      completed,
    };
  });

  const totalUnits = levels.reduce((n, l) => n + l.lessonCount + 1, 0);
  const doneUnits = levels.reduce((n, l) => n + l.lessonsDone + (l.examPassed ? 1 : 0), 0);

  return {
    id: course.id,
    kind: course.kind,
    slug: course.slug,
    title: course.title,
    tagline: course.tagline,
    levels,
    percent: totalUnits ? Math.round((doneUnits / totalUnits) * 100) : 0,
    certificateId: certificate?.id ?? null,
  };
}

/** True if the user may open this lesson (its level is unlocked). */
export async function canAccessLesson(userId: string, lessonId: string): Promise<boolean> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { level: { include: { course: { select: { slug: true } } } } },
  });
  if (!lesson) return false;
  const state = await getCourseState(userId, lesson.level.course.slug);
  return state?.levels.find((l) => l.id === lesson.levelId)?.unlocked ?? false;
}

export interface DailyPlanItem {
  lessonId: string;
  levelId: string;
  courseSlug: string;
  type: string;
  minutes: number;
  title: unknown;
  done: boolean;
}

/**
 * The daily plan: the next incomplete lessons in the user's active levels,
 * capped to ~20 minutes. Mixes both courses so every day includes lesson,
 * vocabulary, speaking, writing, listening, quiz and review material.
 */
export async function getDailyPlan(userId: string): Promise<DailyPlanItem[]> {
  const courses = await prisma.course.findMany({ orderBy: { order: "asc" }, select: { slug: true } });
  const items: DailyPlanItem[] = [];

  for (const c of courses) {
    const state = await getCourseState(userId, c.slug);
    if (!state) continue;
    const active = state.levels.find((l) => l.unlocked && !l.completed);
    if (!active) continue;

    const lessons = await prisma.lesson.findMany({
      where: { levelId: active.id, published: true },
      orderBy: { order: "asc" },
      select: { id: true, type: true, minutes: true, title: true },
    });
    const done = new Set(
      (
        await prisma.lessonProgress.findMany({
          where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
          select: { lessonId: true },
        })
      ).map((p) => p.lessonId),
    );

    let minutes = 0;
    for (const lesson of lessons) {
      if (done.has(lesson.id)) continue;
      if (minutes >= 10 && items.filter((i) => i.courseSlug === c.slug).length >= 3) break;
      items.push({
        lessonId: lesson.id,
        levelId: active.id,
        courseSlug: c.slug,
        type: lesson.type,
        minutes: lesson.minutes,
        title: lesson.title,
        done: false,
      });
      minutes += lesson.minutes;
      if (minutes >= 10) break; // ~10 min per course → ~20 min total
    }
  }

  // Mark items already finished today as done (they stay visible as ticks).
  const today = utcDay();
  const doneToday = await prisma.lessonProgress.findMany({
    where: { userId, completedAt: { gte: today } },
    select: { lessonId: true },
  });
  const doneSet = new Set(doneToday.map((d) => d.lessonId));
  return items.map((i) => ({ ...i, done: doneSet.has(i.lessonId) }));
}
