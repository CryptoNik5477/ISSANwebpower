"use client";

// Interactive Thai character tracing: the character is drawn as a faint
// template on a canvas and the learner traces over it with mouse or touch.

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AudioButton } from "./audio-button";

interface TracingChar {
  char: string;
  name: string;
  roman: string;
}

export function TracingPad({ characters }: { characters: TracingChar[] }) {
  const t = useTranslations("lesson");
  const [index, setIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const current = characters[index];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Template character
    ctx.font = "200px 'Noto Sans Thai', 'Sarabun', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillText(current.char, canvas.width / 2, canvas.height / 2 + 10);
    // Stroke style for the learner
    ctx.strokeStyle = "#f0b830";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [index, current]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  return (
    <div className="mx-auto max-w-sm text-center">
      <div className="mb-2 flex items-center justify-center gap-3">
        <span className="thai text-2xl font-semibold text-white">{current.char}</span>
        <span className="text-sm text-night-300">{current.name}</span>
        <span className="text-xs text-gold-300">{current.roman}</span>
        <AudioButton text={current.char} />
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={280}
        className="glass w-full touch-none !rounded-3xl"
        onPointerDown={(e) => {
          drawing.current = true;
          const ctx = canvasRef.current!.getContext("2d")!;
          const p = pos(e);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = canvasRef.current!.getContext("2d")!;
          const p = pos(e);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }}
        onPointerUp={() => (drawing.current = false)}
        onPointerLeave={() => (drawing.current = false)}
        aria-label={`Trace the character ${current.char}`}
      />
      <p className="mt-2 text-xs text-night-400">{t("tracingHint")}</p>
      <div className="mt-3 flex justify-center gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            // Redraw template only
            setIndex((i) => i); // no-op state to keep types happy
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx && current) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.font = "200px 'Noto Sans Thai', 'Sarabun', sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "rgba(255,255,255,0.08)";
              ctx.fillText(current.char, canvas.width / 2, canvas.height / 2 + 10);
              ctx.strokeStyle = "#f0b830";
              ctx.lineWidth = 7;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
            }
          }}
        >
          {t("clear")}
        </Button>
        <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          ←
        </Button>
        <Button disabled={index >= characters.length - 1} onClick={() => setIndex((i) => i + 1)}>
          →
        </Button>
      </div>
      <p className="mt-2 text-xs text-night-500">
        {index + 1}/{characters.length}
      </p>
    </div>
  );
}
