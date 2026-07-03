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

  const buttonStyles =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-night-200 transition active:scale-95 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-300";

  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={() => play(0.6)} title={slowLabel ?? "Slow"} aria-label={slowLabel ?? "Slow"} className={buttonStyles}>
        <Turtle className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => play(1)} title={normalLabel ?? "Normal"} aria-label={normalLabel ?? "Normal"} className={buttonStyles}>
        <Volume2 className="h-5 w-5" />
      </button>
    </span>
  );
}
