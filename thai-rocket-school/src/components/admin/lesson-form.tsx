// Shared server-rendered lesson editor form (used by new + edit pages).

import { inputStyles } from "@/components/auth/auth-card";
import { buttonStyles } from "@/components/ui/button";
import type { LessonType } from "@prisma/client";

const LESSON_TYPES: LessonType[] = ["LESSON", "VOCABULARY", "SPEAKING", "WRITING", "LISTENING", "QUIZ", "REVIEW"];

export interface LessonFormValues {
  titleEn?: string;
  titleFr?: string;
  titleDe?: string;
  type?: string;
  minutes?: number;
  xpReward?: number;
  day?: number;
  content?: string;
  published?: boolean;
}

export function LessonFormFields({
  values,
  labels,
}: {
  values: LessonFormValues;
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm text-night-300">
          {labels.titleEn}
          <input name="titleEn" required defaultValue={values.titleEn} className={`${inputStyles} mt-1`} />
        </label>
        <label className="block text-sm text-night-300">
          {labels.titleFr}
          <input name="titleFr" required defaultValue={values.titleFr} className={`${inputStyles} mt-1`} />
        </label>
        <label className="block text-sm text-night-300">
          {labels.titleDe}
          <input name="titleDe" required defaultValue={values.titleDe} className={`${inputStyles} mt-1`} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <label className="block text-sm text-night-300">
          {labels.type}
          <select name="type" defaultValue={values.type ?? "LESSON"} className={`${inputStyles} mt-1`}>
            {LESSON_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-night-300">
          {labels.minutes}
          <input name="minutes" type="number" min={1} max={60} defaultValue={values.minutes ?? 5} className={`${inputStyles} mt-1`} />
        </label>
        <label className="block text-sm text-night-300">
          {labels.xp}
          <input name="xpReward" type="number" min={0} max={500} defaultValue={values.xpReward ?? 20} className={`${inputStyles} mt-1`} />
        </label>
        <label className="block text-sm text-night-300">
          Day
          <input name="day" type="number" min={1} max={7} defaultValue={values.day ?? 1} className={`${inputStyles} mt-1`} />
        </label>
      </div>
      <label className="block text-sm text-night-300">
        {labels.content}
        <textarea
          name="content"
          rows={14}
          defaultValue={values.content}
          spellCheck={false}
          className={`${inputStyles} mt-1 font-mono text-xs`}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-night-300">
        <input name="published" type="checkbox" defaultChecked={values.published ?? true} className="h-4 w-4 accent-[#f0b830]" />
        {labels.published}
      </label>
      <button type="submit" className={buttonStyles("primary")}>
        {labels.save}
      </button>
    </div>
  );
}
