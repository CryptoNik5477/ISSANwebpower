import { cn } from "@/lib/utils";

/** Thai Rocket School wordmark with a golden rocket glyph. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="trs-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7e091" />
            <stop offset="100%" stopColor="#e99a18" />
          </linearGradient>
        </defs>
        {/* exhaust glow */}
        <circle cx="10" cy="24" r="7" fill="url(#trs-gold)" opacity="0.18" />
        {/* rocket body, tilted for lift-off */}
        <g transform="rotate(45 16 16)">
          <path d="M16 3 C19.5 6.5 21 11 21 15.5 L21 20 L11 20 L11 15.5 C11 11 12.5 6.5 16 3 Z" fill="url(#trs-gold)" />
          <circle cx="16" cy="12" r="2.4" fill="#0a0d1c" />
          <path d="M11 17 L7.5 22 L11 21 Z" fill="url(#trs-gold)" />
          <path d="M21 17 L24.5 22 L21 21 Z" fill="url(#trs-gold)" />
          <path d="M13.5 21 L16 27 L18.5 21 Z" fill="#f4cc57" opacity="0.85" />
        </g>
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold leading-none tracking-tight">
          <span className="text-gradient-gold">Thai Rocket</span>{" "}
          <span className="text-white">School</span>
        </span>
      )}
    </span>
  );
}
