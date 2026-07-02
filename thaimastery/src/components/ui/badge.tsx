import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "gold",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "gold" | "jade" | "night" | "red" }) {
  const tones = {
    gold: "border-gold-400/30 bg-gold-400/10 text-gold-300",
    jade: "border-jade-500/30 bg-jade-500/10 text-jade-400",
    night: "border-white/15 bg-white/5 text-night-200",
    red: "border-red-400/30 bg-red-400/10 text-red-300",
  };
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
