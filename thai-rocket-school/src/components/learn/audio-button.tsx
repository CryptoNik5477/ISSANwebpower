"use client";

// Pronunciation player. Plays a recorded audio URL when available; otherwise
// falls back to the browser's Thai speech synthesis voice (slow + normal).

import { useCallback } from "react";
import { Volume2, Turtle } from "lucide-react";

// Voices load asynchronously on most mobile browsers — the first
// getVoices() call often returns an empty array. Cache the list once the
// 'voiceschanged' event fires so we don't race it on every tap.
let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function speak(text: string, rate: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  // Chrome/Android in particular doesn't flush the speech queue
  // synchronously on cancel() — starting a new utterance immediately can
  // make it begin partway through the sentence. A short delay lets the
  // engine fully reset before the next utterance starts.
  window.setTimeout(() => {
    if (synth.paused) synth.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH";
    utterance.rate = rate;
    const voices = cachedVoices.length ? cachedVoices : refreshVoices();
    const thai = voices.find((v) => v.lang.startsWith("th"));
    if (thai) utterance.voice = thai;
    synth.speak(utterance);
  }, 80);
}

export function AudioButton({
  text,
  audioUrl,
  slowLabel,
  normalLabel,
}: {
  text: string;
  audioUrl?: string;
  slowLabel?: string;
  normalLabel?: string;
}) {
  const play = useCallback(
    (rate: number) => {
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.playbackRate = rate;
        void audio.play();
      } else {
        speak(text, rate);
      }
    },
    [audioUrl, text],
  );

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => play(0.6)}
        title={slowLabel ?? "Slow"}
        className="rounded-lg p-1.5 text-night-400 transition hover:bg-white/10 hover:text-gold-300"
      >
        <Turtle className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => play(1)}
        title={normalLabel ?? "Normal"}
        className="rounded-lg p-1.5 text-night-400 transition hover:bg-white/10 hover:text-gold-300"
      >
        <Volume2 className="h-4 w-4" />
      </button>
    </span>
  );
}
