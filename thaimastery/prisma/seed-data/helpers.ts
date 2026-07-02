// Helpers used to build the seeded course content.

export type L = { en: string; fr: string; de: string };

export const l = (en: string, fr: string, de: string): L => ({ en, fr, de });

export interface Vocab {
  thai: string;
  roman: string;
  translation: L;
}

export const v = (thai: string, roman: string, en: string, fr: string, de: string): Vocab => ({
  thai,
  roman,
  translation: l(en, fr, de),
});

export interface QuizQ {
  question: L;
  choices: string[];
  answer: number;
}

/** Deterministic pseudo-random pick so seeding is reproducible. */
function pick<T>(arr: T[], seed: number, count: number): T[] {
  const out: T[] = [];
  let s = seed;
  const pool = [...arr];
  while (out.length < count && pool.length) {
    s = (s * 9301 + 49297) % 233280;
    out.push(pool.splice(s % pool.length, 1)[0]);
  }
  return out;
}

/** Build multiple-choice questions "What does <thai> mean?" from a vocab list. */
export function quizFromVocab(vocab: Vocab[], count: number, seed = 7): QuizQ[] {
  const items = pick(vocab, seed, Math.min(count, vocab.length));
  return items.map((item, i) => {
    const wrong = pick(vocab.filter((w) => w !== item), seed + i + 1, 3);
    const choices = [item, ...wrong].map((w) => w.translation.en);
    // Rotate deterministically so the answer isn't always first.
    const rot = (seed + i) % choices.length;
    const rotated = [...choices.slice(rot), ...choices.slice(0, rot)];
    return {
      question: l(
        `What does “${item.thai}” (${item.roman}) mean?`,
        `Que signifie « ${item.thai} » (${item.roman}) ?`,
        `Was bedeutet „${item.thai}“ (${item.roman})?`,
      ),
      choices: rotated,
      answer: rotated.indexOf(item.translation.en),
    };
  });
}

/** Reverse questions: "How do you say <english> in Thai?" */
export function reverseQuizFromVocab(vocab: Vocab[], count: number, seed = 13): QuizQ[] {
  const items = pick(vocab, seed, Math.min(count, vocab.length));
  return items.map((item, i) => {
    const wrong = pick(vocab.filter((w) => w !== item), seed + i + 2, 3);
    const choices = [item, ...wrong].map((w) => `${w.thai} (${w.roman})`);
    const rot = (seed + i + 1) % choices.length;
    const rotated = [...choices.slice(rot), ...choices.slice(0, rot)];
    return {
      question: l(
        `How do you say “${item.translation.en}” in Thai?`,
        `Comment dit-on « ${item.translation.fr} » en thaï ?`,
        `Wie sagt man „${item.translation.de}“ auf Thai?`,
      ),
      choices: rotated,
      answer: rotated.indexOf(`${item.thai} (${item.roman})`),
    };
  });
}
