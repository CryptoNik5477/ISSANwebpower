import { describe, it, expect } from "vitest";
import { similarityScore } from "@/lib/ai";

describe("similarityScore (pronunciation heuristic)", () => {
  it("identical strings score 100", () => {
    expect(similarityScore("sawatdii", "sawatdii")).toBe(100);
  });

  it("empty attempt scores 0", () => {
    expect(similarityScore("sawatdii", "")).toBe(0);
  });

  it("close attempts score high", () => {
    expect(similarityScore("sawatdii", "sawatdee")).toBeGreaterThanOrEqual(70);
  });

  it("unrelated attempts score low", () => {
    expect(similarityScore("sawatdii", "zzzzzzzz")).toBeLessThan(30);
  });
});
