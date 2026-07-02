"use client";

// AI conversation simulator — role-plays the lesson scenario with the learner.

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Bot, User } from "lucide-react";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

export function AiTutor({ scenario }: { scenario: string }) {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const [history, setHistory] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    const message = input.trim();
    if (!message) return;
    const next: Turn[] = [...history, { role: "user", content: message }];
    setHistory(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: next, locale, scenario }),
      });
      const data = await res.json();
      setHistory([...next, { role: "assistant", content: data.reply ?? "…" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass !p-5">
      <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-white">
        <Bot className="h-5 w-5 text-gold-400" /> {t("aiTutor")}
      </h3>
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {history.map((turn, i) => (
          <div key={i} className={`flex gap-2 ${turn.role === "user" ? "justify-end" : ""}`}>
            {turn.role === "assistant" && <Bot className="mt-1 h-4 w-4 shrink-0 text-gold-400" />}
            <p
              className={`thai max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                turn.role === "user" ? "bg-gold-400/15 text-white" : "bg-white/5 text-night-100"
              }`}
            >
              {turn.content}
            </p>
            {turn.role === "user" && <User className="mt-1 h-4 w-4 shrink-0 text-night-400" />}
          </div>
        ))}
        {busy && <p className="text-sm text-night-400">…</p>}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("aiTutorPlaceholder")}
          className="thai flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-night-400 outline-none focus:border-gold-400/60"
        />
        <Button type="submit" disabled={busy || !input.trim()}>
          {t("aiSend")}
        </Button>
      </form>
    </div>
  );
}
