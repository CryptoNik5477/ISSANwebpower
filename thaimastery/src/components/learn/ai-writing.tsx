"use client";

// AI writing & grammar correction for the writing course.

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

export function AiWriting() {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function check() {
    setBusy(true);
    try {
      const res = await fetch("/api/ai/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, locale }),
      });
      const data = await res.json();
      setResult(data.correction ?? null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass !p-5">
      <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-white">
        <PenLine className="h-5 w-5 text-gold-400" /> {t("aiWriting")}
      </h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={t("aiWritingPlaceholder")}
        className="thai w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-night-400 outline-none focus:border-gold-400/60"
      />
      <Button className="mt-3" disabled={busy || !text.trim()} onClick={check}>
        {busy ? "…" : t("aiCheck")}
      </Button>
      {result && <p className="thai mt-4 whitespace-pre-wrap rounded-xl bg-white/5 p-4 text-sm text-night-100">{result}</p>}
    </div>
  );
}
