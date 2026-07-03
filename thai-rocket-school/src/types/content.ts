// Shared content-model types. Lesson content is stored in the database as an
// ordered array of ContentBlock (Json column) so the admin panel can compose
// lessons from reusable building blocks.

export type Locale = "en" | "fr" | "de";

/** Localised text stored as JSON — always provides all three locales. */
export type LocalizedText = Record<Locale, string>;

export interface VocabItem {
  thai: string;
  /** Romanised pronunciation, e.g. "sà-wàt-dii" */
  roman: string;
  translation: LocalizedText;
  /** Optional URL of a native-speaker recording. */
  audioUrl?: string;
}

export interface QuizQuestion {
  question: LocalizedText;
  /** Choices are usually Thai/romanised strings, identical across locales. */
  choices: string[];
  /** Index into `choices`. */
  answer: number;
}

export interface DialogueLine {
  speaker: string;
  thai: string;
  roman: string;
  translation: LocalizedText;
}

export type ContentBlock =
  | { type: "text"; body: LocalizedText }
  | { type: "vocab"; items: VocabItem[] }
  | { type: "flashcards"; items: VocabItem[] }
  | { type: "dialogue"; lines: DialogueLine[] }
  | { type: "quiz"; questions: QuizQuestion[] }
  | { type: "video"; url: string; caption?: LocalizedText }
  | { type: "audio"; url: string; caption?: LocalizedText }
  | { type: "image"; url: string; alt?: LocalizedText }
  | { type: "pdf"; url: string; label?: LocalizedText }
  | { type: "tracing"; characters: { char: string; name: string; roman: string }[] }
  | { type: "speaking"; prompts: { thai: string; roman: string; translation: LocalizedText }[] }
  | { type: "tip"; body: LocalizedText };

export interface ExamQuestionSet {
  questions: QuizQuestion[];
}
