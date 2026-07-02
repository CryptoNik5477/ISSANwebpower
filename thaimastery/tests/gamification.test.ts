import { describe, it, expect } from "vitest";
import { nextStreak, xpForLevel, levelFromXp } from "@/lib/gamification";

describe("nextStreak", () => {
  const day = (offset: number) => new Date(Date.UTC(2026, 0, 10 + offset, 12));

  it("starts a streak on first activity", () => {
    expect(nextStreak(null, 0, day(0))).toBe(1);
  });

  it("keeps the streak when already active today", () => {
    expect(nextStreak(day(0), 5, day(0))).toBe(5);
  });

  it("increments on consecutive days", () => {
    expect(nextStreak(day(0), 5, day(1))).toBe(6);
  });

  it("resets after a missed day", () => {
    expect(nextStreak(day(0), 30, day(2))).toBe(1);
  });

  it("never returns less than 1 for same-day activity", () => {
    expect(nextStreak(day(0), 0, day(0))).toBe(1);
  });
});

describe("xp levels", () => {
  it("level 1 requires 0 XP", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(levelFromXp(0)).toBe(1);
  });

  it("levels grow quadratically", () => {
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(300);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(300)).toBe(3);
  });
});
