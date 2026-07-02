// AI-assisted learning features backed by the Claude API (official SDK).
// Every feature has a deterministic heuristic fallback so the platform remains
// fully functional when ANTHROPIC_API_KEY is not configured.

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-4-8";

let client: Anthropic | null = null;

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function anthropic(): Anthropic {
  client ??= new Anthropic();
  return client;
}

async function complete(system: string, user: string, maxTokens = 1024): Promise<string> {
  const response = await anthropic().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = response.content.find((b) => b.type === "text");
  return text?.type === "text" ? text.text : "";
}

// ─── Conversation simulator ───────────────────────────────────────────────────

export interface TutorTurn {
  role: "user" | "assistant";
  content: string;
}

export async function tutorReply(history: TutorTurn[], locale: string, scenario: string): Promise<string> {
  if (!aiConfigured()) {
    return heuristicTutorReply(locale);
  }
  const system = `You are Khru Nok, a friendly native Thai language tutor on the ThaiMastery platform.
Role-play the scenario: "${scenario}". The student is a beginner whose interface language is "${locale}".
Rules:
- Reply in Thai first (short, natural sentence), then romanisation in parentheses, then a translation in the student's interface language.
- Keep replies to 1-3 short sentences. Gently correct mistakes by showing the corrected Thai.
- Stay in the scenario and encourage the student to answer in Thai.`;
  const messages = history.slice(-12);
  const response = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 512,
    system,
    messages: messages.length ? messages : [{ role: "user", content: "สวัสดีครับ" }],
  });
  const text = response.content.find((b) => b.type === "text");
  return text?.type === "text" ? text.text : heuristicTutorReply(locale);
}

function heuristicTutorReply(locale: string): string {
  const notes: Record<string, string> = {
    en: "Great! Try answering in Thai. Tip: end sentences with khráp (male) or khâ (female) to be polite.",
    fr: "Très bien ! Essayez de répondre en thaï. Astuce : terminez vos phrases par khráp (homme) ou khâ (femme) pour être poli.",
    de: "Sehr gut! Versuche auf Thai zu antworten. Tipp: Beende Sätze mit khráp (männlich) oder khâ (weiblich), um höflich zu sein.",
  };
  return `สวัสดีครับ ยินดีที่ได้รู้จัก (sà-wàt-dii khráp, yin-dii thîi dâi rúu-jàk)\n\n${notes[locale] ?? notes.en}`;
}

// ─── Writing / grammar correction ────────────────────────────────────────────

export async function correctWriting(text: string, locale: string): Promise<string> {
  if (!aiConfigured()) {
    const notes: Record<string, string> = {
      en: "AI correction is not configured on this server. Compare your writing with the model sentences in the lesson.",
      fr: "La correction IA n'est pas configurée sur ce serveur. Comparez votre texte avec les phrases modèles de la leçon.",
      de: "Die KI-Korrektur ist auf diesem Server nicht konfiguriert. Vergleiche deinen Text mit den Mustersätzen der Lektion.",
    };
    return notes[locale] ?? notes.en;
  }
  return complete(
    `You are a Thai language teacher. The student writes Thai (possibly with romanisation). Correct spelling, grammar and word order.
Answer in the student's interface language ("${locale}"). Format: corrected Thai sentence, romanisation, then a 1-2 sentence explanation of each fix. Be encouraging.`,
    text,
    700,
  );
}

// ─── Pronunciation feedback (on transcribed / romanised attempts) ────────────

export async function pronunciationFeedback(target: string, attempt: string, locale: string): Promise<{ score: number; feedback: string }> {
  // Heuristic similarity always computed — used as fallback and sanity check.
  const score = similarityScore(normalise(target), normalise(attempt));
  if (!aiConfigured()) {
    const notes: Record<string, string> = {
      en: score >= 80 ? "Very close! Watch the tone marks and vowel length." : "Keep practising — listen to the native audio and repeat slowly.",
      fr: score >= 80 ? "Très proche ! Attention aux tons et à la longueur des voyelles." : "Continuez à pratiquer — écoutez l'audio natif et répétez lentement.",
      de: score >= 80 ? "Sehr nah dran! Achte auf die Töne und Vokallängen." : "Weiter üben — höre dir die Audioaufnahme an und wiederhole langsam.",
    };
    return { score, feedback: notes[locale] ?? notes.en };
  }
  const feedback = await complete(
    `You are a Thai pronunciation coach. Compare the student's romanised attempt with the target phrase. Point out tone, vowel-length and consonant issues in 2-3 sentences, in language "${locale}".`,
    `Target: ${target}\nStudent attempt: ${attempt}`,
    400,
  );
  return { score, feedback };
}

function normalise(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z฀-๿]/g, "");
}

/** Levenshtein-based similarity 0–100. */
export function similarityScore(a: string, b: string): number {
  if (!a.length && !b.length) return 100;
  if (!a.length || !b.length) return 0;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  const dist = dp[a.length][b.length];
  return Math.max(0, Math.round((1 - dist / Math.max(a.length, b.length)) * 100));
}
