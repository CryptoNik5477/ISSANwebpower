"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { VocabItem } from "@/types/content";
import { lt } from "@/lib/utils";
import { AudioButton } from "./audio-button";
import { Button } from "@/components/ui/button";

export function Flashcards({ items }: { items: VocabItem[] }) {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [again, setAgain] = useState<VocabItem[]>([]);
  const deck = [...items, ...again];
  const card = deck[index];

  if (!card) {
    return (
      <p className="rounded-xl border border-jade-500/30 bg-jade-500/10 p-4 text-center text-sm text-jade-400">
        ✓ {index}/{deck.length}
      </p>
    );
  }

  function next(needsPractice: boolean) {
    if (needsPractice) setAgain((a) => [...a, card]);
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-sm">
      <p className="mb-2 text-center text-xs text-night-400">
        {index + 1}/{deck.length} · {t("flashcardsHint")}
      </p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="glass block h-52 w-full animate-pop cursor-pointer p-6 text-center transition hover:border-gold-400/40"
        style={{ animationDelay: "0s" }}
        key={`${index}-${flipped}`}
      >
        {!flipped ? (
          <span className="flex h-full flex-col items-center justify-center gap-2">
            <span className="thai text-4xl font-semibold text-white">{card.thai}</span>
            <span className="text-sm text-gold-300">{card.roman}</span>
          </span>
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-2">
            <span className="text-2xl font-semibold text-jade-400">{lt(card.translation, locale)}</span>
            <span className="text-sm text-night-300">{card.roman}</span>
          </span>
        )}
      </button>
      <div className="mt-3 flex items-center justify-center gap-2">
        <AudioButton text={card.thai} audioUrl={card.audioUrl} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => next(true)}>
          {t("unknown")}
        </Button>
        <Button onClick={() => next(false)}>{t("known")}</Button>
      </div>
    </div>
  );
}
