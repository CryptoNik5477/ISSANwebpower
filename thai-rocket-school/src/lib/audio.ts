// Extracts every distinct Thai phrase referenced by a lesson's content
// blocks (vocabulary, dialogue, speaking prompts, tracing characters) and
// resolves them against pre-generated VoiceClip recordings.

import { prisma } from "./prisma";
import type { ContentBlock } from "@/types/content";

export function extractThaiTexts(content: ContentBlock[]): string[] {
  const texts = new Set<string>();
  for (const block of content) {
    switch (block.type) {
      case "vocab":
      case "flashcards":
        for (const item of block.items) texts.add(item.thai);
        break;
      case "dialogue":
        for (const line of block.lines) texts.add(line.thai);
        break;
      case "speaking":
        for (const prompt of block.prompts) texts.add(prompt.thai);
        break;
      case "tracing":
        for (const char of block.characters) texts.add(char.char);
        break;
      default:
        break;
    }
  }
  return [...texts];
}

/** Looks up pre-generated audio URLs for the given Thai texts (batched). */
export async function resolveAudioMap(texts: string[]): Promise<Map<string, string>> {
  if (texts.length === 0) return new Map();
  const rows = await prisma.voiceClip.findMany({
    where: { text: { in: texts } },
    select: { text: true, url: true },
  });
  return new Map(rows.map((r) => [r.text, r.url]));
}
