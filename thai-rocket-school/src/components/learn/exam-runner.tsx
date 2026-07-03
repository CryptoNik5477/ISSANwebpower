"use client";

// Level examination: one question at a time, submits all answers at the end.
// The server grades the attempt and unlocks the next level at ≥ passScore.

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import type { QuizQuestion } from "@/types/content";
import { lt, cn } from "@/lib/utils";
import { Button, buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

interface ExamResult {
  score: number;
  passed: boolean;
  certificateId?: string;
}

export function ExamRunner({
  examId,
  passScore,
  questions,
  courseSlug,
}: {
  examId: string;
  passScore: number;
  questions: QuizQuestion[];
  courseSlug: string;
}) {
  const t = useTranslations("exam");
  const locale = useLocale();
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(finalAnswers: number[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId, answers: finalAnswers }),
      });
      if (res.ok) setResult(await res.json());
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="glass animate-pop space-y-6 p-8 text-center">
        <div className="text-6xl">{result.passed ? "🎉" : "💪"}</div>
        <p className={cn("font-display text-xl font-bold", result.passed ? "text-jade-400" : "text-gold-300")}>
          {result.passed ? t("passed", { score: result.score }) : t("failed", { score: result.score, passScore })}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {result.passed ? (
            <button
              className={buttonStyles("primary")}
              onClick={() => {
                router.push(`/courses/${courseSlug}`);
                router.refresh();
              }}
            >
              {t("nextLevel")}
            </button>
          ) : (
            <Button
              onClick={() => {
                setResult(null);
                setStarted(false);
                setCurrent(0);
                setAnswers([]);
              }}
            >
              {t("retake")}
            </Button>
          )}
          <Link href={`/courses/${courseSlug}`} className={buttonStyles("secondary")}>
            {t("backToCourse")}
          </Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="glass space-y-6 p-8 text-center">
        <div className="text-5xl">🎓</div>
        <p className="text-night-200">{t("intro", { passScore })}</p>
        <Button className="px-8 py-3" onClick={() => setStarted(true)}>
          {t("start")}
        </Button>
      </div>
    );
  }

  const q = questions[current];
  const isLast = current === questions.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ProgressBar value={((current + 1) / questions.length) * 100} className="flex-1" />
        <span className="whitespace-nowrap text-sm text-night-300">
          {t("question", { current: current + 1, total: questions.length })}
        </span>
      </div>
      <div className="glass p-6">
        <p className="thai mb-5 text-lg font-medium text-white">{lt(q.question, locale)}</p>
        <div className="grid gap-2.5">
          {q.choices.map((choice, ci) => (
            <button
              key={ci}
              type="button"
              disabled={busy}
              className="thai rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-night-100 transition hover:border-gold-400/50 hover:bg-gold-400/5"
              onClick={() => {
                const next = [...answers, ci];
                setAnswers(next);
                if (isLast) {
                  void submit(next);
                } else {
                  setCurrent((c) => c + 1);
                }
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
      {busy && <p className="text-center text-sm text-night-400">…</p>}
    </div>
  );
}
