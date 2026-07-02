import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale, LocalizedText } from "@/types/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Read a localised Json column with graceful fallback to English. */
export function lt(value: unknown, locale: string): string {
  if (!value || typeof value !== "object") return "";
  const map = value as Partial<LocalizedText>;
  return map[locale as Locale] ?? map.en ?? Object.values(map)[0] ?? "";
}

export function formatPrice(cents: number, locale: string, currency = "EUR"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}

export function formatDate(date: Date | string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(date));
}

/** Midnight UTC for streak/day bucketing. */
export function utcDay(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((utcDay(b).getTime() - utcDay(a).getTime()) / 86_400_000);
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
