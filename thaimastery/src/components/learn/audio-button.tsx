"use client";

// Pronunciation player. Plays a recorded audio URL when available; otherwise
// falls back to the browser's Thai speech synthesis voice (slow + normal).

import { useCallback } from "react";
import { Volume2, Turtle } from "lucide-react";

function speak(text: string, rate: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "th-TH";
  utterance.rate = rate;
  const thai = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("th"));
  if (thai) utterance.voice = thai;
  window.speechSynthesis.speak(utterance);
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
