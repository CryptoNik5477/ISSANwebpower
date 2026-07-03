// Native-quality Thai pronunciation via ElevenLabs Text-to-Speech.
// Requires ELEVENLABS_API_KEY (free account, no credit card needed for
// testing). Optional ELEVENLABS_VOICE_ID to pick a specific voice — defaults
// to "Rachel", one of ElevenLabs' standard pre-made voices available on
// every account, which speaks Thai naturally via the multilingual model.
// Falls back gracefully — callers should treat ttsConfigured() === false as
// "not configured" and keep using the browser TTS fallback.

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // "Rachel"

export function ttsConfigured(): boolean {
  return Boolean(process.env.ELEVENLABS_API_KEY);
}

/**
 * Synthesizes `text` as Thai speech and returns raw MP3 bytes.
 */
export async function synthesizeThai(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");
  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
    // Don't let one slow/hanging call stall the whole batch (and blow the
    // serverless function's time budget) — fail fast and let the caller retry.
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  if (arrayBuffer.byteLength === 0) throw new Error("ElevenLabs returned no audio content");
  return Buffer.from(arrayBuffer);
}
