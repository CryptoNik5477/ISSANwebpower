"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { QuizQuestion } from "@/types/content";
import { lt, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function QuizRunner({
  questions,
  onScore,
}: {
  questions: QuizQuestion[];
  onScore?: (score: number) => void;
}) {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  function check() {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    const s = Math.round((correct / questions.length) * 100);
    setScore(s);
    setChecked(true);
    onScore?.(s);
  }

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <fieldset key={qi} className="glass !p-5">
          <legend className="sr-only">{lt(q.question, locale)}</legend>
          <p className="mb-3 font-medium text-white">
            {qi + 1}. <span className="thai">{lt(q.question, locale)}</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.choices.map((choice, ci) => {
              const selected = answers[qi] === ci;
              const isCorrect = checked && ci === q.answer;
              const isWrong = checked && selected && ci !== q.answer;
              return (
                <button
                  key={ci}
                  type="button"
                  disabled={checked}
                  onClick={() => setAnswers((a) => a.map((x, i) => (i === qi ? ci : x)))}
                  className={cn(
                    "thai rounded-xl border px-4 py-2.5 text-left text-sm transition",
                    selected ? "border-gold-400/60 bg-gold-400/10 text-white" : "border-white/10 bg-white/[0.03] text-night-200 hover:border-white/25",
                    isCorrect && "border-jade-500/70 bg-jade-500/15 text-jade-300",
                    isWrong && "border-red-400/70 bg-red-400/10 text-red-300",
                  )}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      {checked ? (
        <p className={cn("rounded-xl border p-4 text-center font-medium", score >= 80 ? "border-jade-500/30 bg-jade-500/10 text-jade-400" : "border-gold-400/30 bg-gold-400/10 text-gold-300")}>
          {t("quizResult", { score })}
        </p>
      ) : (
        <Button className="w-full py-3" disabled={answers.some((a) => a === null)} onClick={check}>
          {t("quizSubmit")}
        </Button>
      )}
    </div>
  );
}
