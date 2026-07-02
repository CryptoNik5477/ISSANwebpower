"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function CompleteLessonButton({
  lessonId,
  minutes,
  xp,
  done,
  courseSlug,
}: {
  lessonId: string;
  minutes: number;
  xp: number;
  done: boolean;
  courseSlug: string;
}) {
  const t = useTranslations("lesson");
  const router = useRouter();
  const [state, setState] = useState<"idle" | "busy" | "done">(done ? "done" : "idle");

  async function complete() {
    setState("busy");
    const res = await fetch("/api/progress/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, minutes }),
    });
    if (res.ok) {
      setState("done");
      setTimeout(() => {
        router.push(`/courses/${courseSlug}`);
        router.refresh();
      }, 900);
    } else {
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p className="flex animate-pop items-center justify-center gap-2 rounded-xl border border-jade-500/30 bg-jade-500/10 p-4 font-medium text-jade-400">
        <CheckCircle2 className="h-5 w-5" /> {t("completed", { xp })}
      </p>
    );
  }

  return (
    <Button className="w-full py-3.5 text-base" disabled={state === "busy"} onClick={complete}>
      {state === "busy" ? "…" : `${t("complete")} · +${xp} XP`}
    </Button>
  );
}
