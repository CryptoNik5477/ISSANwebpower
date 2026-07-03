// Native-quality Thai pronunciation via Google Cloud Text-to-Speech.
// Requires GOOGLE_TTS_API_KEY (Cloud Text-to-Speech API enabled, key
// restricted to that API). Falls back gracefully — callers should treat a
// null return as "not configured" and keep using the browser TTS fallback.

export function ttsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_TTS_API_KEY);
}

/**
 * Synthesizes `text` as Thai speech and returns raw MP3 bytes.
 * Uses languageCode + ssmlGender only (no hardcoded voice name) so Google
 * picks whichever th-TH voice is available on their end — voice inventories
 * change over time and we don't want a stale voice name to break every call.
 */
export async function synthesizeThai(text: string): Promise<Buffer> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_TTS_API_KEY is not configured");

  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "th-TH", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3", speakingRate: 0.92 },
    }),
    // Don't let one slow/hanging call stall the whole batch (and blow the
    // serverless function's time budget) — fail fast and let the caller retry.
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google TTS request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as { audioContent?: string };
  if (!data.audioContent) throw new Error("Google TTS returned no audio content");
  return Buffer.from(data.audioContent, "base64");
}
