import { cn } from "@/lib/utils";

/** ThaiMastery wordmark with a stylised lotus/temple glyph. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="tm-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7e091" />
            <stop offset="100%" stopColor="#e99a18" />
          </linearGradient>
        </defs>
        <path
          d="M16 3 L20 10 L28 12 L22 18 L24 27 L16 22.5 L8 27 L10 18 L4 12 L12 10 Z"
          fill="url(#tm-gold)"
          opacity="0.25"
        />
        <path d="M16 6 C19 11 22 13 22 18 a6 6 0 0 1 -12 0 c0-5 3-7 6-12 Z" fill="url(#tm-gold)" />
      </svg>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight">
          <span className="text-gradient-gold">Thai</span>
          <span className="text-white">Mastery</span>
        </span>
      )}
    </span>
  );
}
