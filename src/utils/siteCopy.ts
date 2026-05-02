import type { Bilingual } from "../types/siteConfig";

export type Lang = "en" | "zh";

export function pickBilingual(lang: Lang, field: Bilingual | undefined, fallback: string): string {
  const raw = field?.[lang]?.trim();
  if (raw) return raw;
  return fallback;
}
