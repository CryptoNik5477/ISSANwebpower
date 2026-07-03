"use client";

// Speaking practice with pronunciation comparison. The learner listens to the
// phrase, repeats it (browser speech recognition when available, otherwise a
// typed romanised attempt) and receives a similarity score + AI feedback.

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { LocalizedText } from "@/types/content";
import { lt } from "@/lib/utils";
import { AudioButton } from "./audio-button";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface Prompt {
  thai: string;
  roman: string;
  translation: LocalizedText;
  audioUrl?: string;
}

export function SpeakingPractice({ prompts }: { prompts: Prompt[] }) {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState("");
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const prompt = prompts[index % prompts.length];

  function listen() {
    const SR =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "th-TH";
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      setAttempt(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  async function check() {
    setBusy(true);
    try {
      const res = await fetch("/api/ai/pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: `${prompt.thai} ${prompt.roman}`, attempt, locale }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <p className="text-sm text-night-300">{t("speakingHint")}</p>
      <div className="glass p-6 text-center">
        <p className="thai text-2xl font-semibold text-white">{prompt.thai}</p>
        <p className="mt-1 text-gold-300">{prompt.roman}</p>
        <p className="mt-1 text-sm text-night-300">{lt(prompt.translation, locale)}</p>
        <div className="mt-3 flex justify-center">
          <AudioButton text={prompt.thai} audioUrl={prompt.audioUrl} slowLabel={t("playSlow")} normalLabel={t("playNormal")} />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={listen}
          className={`rounded-xl border px-4 transition ${listening ? "border-red-400 bg-red-400/20 text-red-300" : "border-white/10 bg-white/5 text-night-200 hover:border-gold-400/40"}`}
          title={t("record")}
        >
          <Mic className="h-5 w-5" />
        </button>
        <input
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
          placeholder={t("attemptPlaceholder")}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-night-400 outline-none focus:border-gold-400/60"
        />
      </div>
      <Button className="w-full" disabled={!attempt || busy} onClick={check}>
        {busy ? "…" : t("checkPronunciation")}
      </Button>
      {result && (
        <div className="glass animate-pop !p-5">
          <p className="font-display text-2xl font-bold text-gradient-gold">{result.score}%</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-night-200">{result.feedback}</p>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <button className="text-night-400 hover:text-white" disabled={index === 0} onClick={() => { setIndex((i) => i - 1); setResult(null); setAttempt(""); }}>
          ←
        </button>
        <span className="text-night-500">{(index % prompts.length) + 1}/{prompts.length}</span>
        <button className="text-night-400 hover:text-white" disabled={index >= prompts.length - 1} onClick={() => { setIndex((i) => i + 1); setResult(null); setAttempt(""); }}>
          →
        </button>
      </div>
    </div>
  );
}
