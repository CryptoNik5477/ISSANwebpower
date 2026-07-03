// Renders the ordered content blocks of a lesson. Server-safe wrapper that
// delegates interactive blocks to client components.

import { getLocale, getTranslations } from "next-intl/server";
import type { ContentBlock } from "@/types/content";
import { lt } from "@/lib/utils";
import { extractThaiTexts, resolveAudioMap } from "@/lib/audio";
import { Flashcards } from "./flashcards";
import { QuizRunner } from "./quiz-runner";
import { TracingPad } from "./tracing-pad";
import { SpeakingPractice } from "./speaking-practice";
import { AudioButton } from "./audio-button";
import { Lightbulb, FileDown } from "lucide-react";

export async function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  const locale = await getLocale();
  const t = await getTranslations("lesson");
  // Native-quality audio, pre-generated per Thai phrase — falls back to the
  // browser's speech synthesis (inside AudioButton) for anything not yet recorded.
  const audioMap = await resolveAudioMap(extractThaiTexts(blocks));

  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return (
              <p key={i} className="leading-relaxed text-night-200">
                {lt(block.body, locale)}
              </p>
            );
          case "tip":
            return (
              <div key={i} className="flex gap-3 rounded-xl border border-gold-400/20 bg-gold-400/5 p-4 text-sm text-gold-200">
                <Lightbulb className="h-5 w-5 shrink-0 text-gold-400" />
                {lt(block.body, locale)}
              </div>
            );
          case "vocab":
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {block.items.map((item) => (
                      <tr key={item.thai} className="border-b border-white/5">
                        <td className="thai py-2.5 pr-4 text-lg font-semibold text-white">{item.thai}</td>
                        <td className="py-2.5 pr-4 text-gold-300">{item.roman}</td>
                        <td className="py-2.5 pr-4 text-night-200">{lt(item.translation, locale)}</td>
                        <td className="py-2.5 text-right">
                          <AudioButton text={item.thai} audioUrl={item.audioUrl ?? audioMap.get(item.thai)} slowLabel={t("playSlow")} normalLabel={t("playNormal")} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "dialogue":
            return (
              <div key={i} className="space-y-3">
                {block.lines.map((line, li) => (
                  <div key={li} className={`flex ${line.speaker === "B" ? "justify-end" : ""}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${line.speaker === "B" ? "bg-gold-400/10" : "bg-white/5"}`}>
                      <p className="thai font-medium text-white">
                        {line.thai} <AudioButton text={line.thai} audioUrl={audioMap.get(line.thai)} />
                      </p>
                      <p className="text-sm text-gold-300">{line.roman}</p>
                      <p className="mt-1 text-xs text-night-300">{lt(line.translation, locale)}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          case "flashcards":
            return (
              <Flashcards
                key={i}
                items={block.items.map((it) => ({ ...it, audioUrl: it.audioUrl ?? audioMap.get(it.thai) }))}
              />
            );
          case "quiz":
            return <QuizRunner key={i} questions={block.questions} />;
          case "tracing":
            return (
              <TracingPad
                key={i}
                characters={block.characters.map((c) => ({ ...c, audioUrl: audioMap.get(c.char) }))}
              />
            );
          case "speaking":
            return (
              <SpeakingPractice
                key={i}
                prompts={block.prompts.map((p) => ({ ...p, audioUrl: audioMap.get(p.thai) }))}
              />
            );
          case "video":
            return (
              <video key={i} controls preload="metadata" className="w-full rounded-2xl border border-white/10" src={block.url}>
                {block.caption && <track kind="captions" />}
              </video>
            );
          case "audio":
            return <audio key={i} controls className="w-full" src={block.url} />;
          case "image":
            // eslint-disable-next-line @next/next/no-img-element
            return <img key={i} src={block.url} alt={block.alt ? lt(block.alt, locale) : ""} className="w-full rounded-2xl border border-white/10" />;
          case "pdf":
            return (
              <a key={i} href={block.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-night-200 transition hover:border-gold-400/40">
                <FileDown className="h-5 w-5 text-gold-400" />
                {block.label ? lt(block.label, locale) : "PDF"}
              </a>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
