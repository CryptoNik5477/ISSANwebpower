// Native-quality Thai pronunciation via Azure Cognitive Services Speech.
// Requires AZURE_SPEECH_KEY + AZURE_SPEECH_REGION (create a "Speech" resource
// in the Azure Portal). Falls back gracefully — callers should treat
// ttsConfigured() === false as "not configured" and keep using the browser
// TTS fallback.

const VOICE_NAME = "th-TH-PremwadeeNeural";

export function ttsConfigured(): boolean {
  return Boolean(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION);
}

function escapeSsml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Synthesizes `text` as Thai speech and returns raw MP3 bytes.
 */
export async function synthesizeThai(text: string): Promise<Buffer> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) throw new Error("AZURE_SPEECH_KEY / AZURE_SPEECH_REGION is not configured");

  const ssml = `<speak version="1.0" xml:lang="th-TH"><voice name="${VOICE_NAME}"><prosody rate="0.92">${escapeSsml(text)}</prosody></voice></speak>`;

  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
    },
    body: ssml,
    // Don't let one slow/hanging call stall the whole batch (and blow the
    // serverless function's time budget) — fail fast and let the caller retry.
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Azure Speech request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  if (arrayBuffer.byteLength === 0) throw new Error("Azure Speech returned no audio content");
  return Buffer.from(arrayBuffer);
}
