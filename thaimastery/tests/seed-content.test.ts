import { describe, it, expect } from "vitest";
import { quizFromVocab, reverseQuizFromVocab, v } from "../prisma/seed-data/helpers";
import { speakingLevels } from "../prisma/seed-data/speaking";
import { writingLevels } from "../prisma/seed-data/writing";

const vocab = [
  v("สวัสดี", "sà-wàt-dii", "hello", "bonjour", "hallo"),
  v("ขอบคุณ", "khàwp-khun", "thank you", "merci", "danke"),
  v("ลาก่อน", "laa-gàwn", "goodbye", "au revoir", "auf Wiedersehen"),
  v("ไม่เป็นไร", "mâi pen rai", "no problem", "pas de problème", "kein Problem"),
  v("ครับ", "khráp", "polite (m)", "poli (h)", "höflich (m)"),
];

describe("quiz generation", () => {
  it("every generated question has a valid answer index", () => {
    for (const q of [...quizFromVocab(vocab, 5), ...reverseQuizFromVocab(vocab, 5)]) {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.choices.length);
      expect(q.choices.length).toBe(4);
      expect(new Set(q.choices).size).toBe(q.choices.length); // no duplicate choices
    }
  });

  it("is deterministic for reproducible seeding", () => {
    expect(quizFromVocab(vocab, 3)).toEqual(quizFromVocab(vocab, 3));
  });
});

describe("course content", () => {
  it("speaking course has 9 levels with vocab + dialogue in all locales", () => {
    expect(speakingLevels).toHaveLength(9);
    for (const level of speakingLevels) {
      expect(level.vocab.length).toBeGreaterThanOrEqual(5);
      expect(level.dialogue.length).toBeGreaterThanOrEqual(3);
      for (const w of level.vocab) {
        expect(w.translation.en).toBeTruthy();
        expect(w.translation.fr).toBeTruthy();
        expect(w.translation.de).toBeTruthy();
      }
    }
  });

  it("writing course has 10 levels covering the script", () => {
    expect(writingLevels).toHaveLength(10);
    const withChars = writingLevels.filter((l) => l.characters.length > 0);
    expect(withChars.length).toBeGreaterThanOrEqual(5); // consonants, vowels, tone marks…
  });

  it("level slugs are unique per course", () => {
    const s = speakingLevels.map((l) => l.slug);
    const w = writingLevels.map((l) => l.slug);
    expect(new Set(s).size).toBe(s.length);
    expect(new Set(w).size).toBe(w.length);
  });
});
