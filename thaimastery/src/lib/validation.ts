import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  locale: z.enum(["en", "fr", "de"]).default("en"),
  referralCode: z.string().max(64).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(200),
});

export const quizSubmitSchema = z.object({
  lessonId: z.string().min(1),
  /** Selected choice index per question, in order. */
  answers: z.array(z.number().int().min(0)).max(100),
  minutes: z.number().int().min(0).max(120).default(5),
});

export const lessonCompleteSchema = z.object({
  lessonId: z.string().min(1),
  minutes: z.number().int().min(0).max(120).default(5),
  score: z.number().int().min(0).max(100).optional(),
});

export const examSubmitSchema = z.object({
  examId: z.string().min(1),
  answers: z.array(z.number().int().min(0)).max(200),
});

export const checkoutSchema = z.object({
  plan: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]),
  locale: z.enum(["en", "fr", "de"]).default("en"),
});
