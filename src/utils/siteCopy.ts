import type { Bilingual } from "../types/siteConfig";

export type Lang = "en" | "zh";

export function pickBilingual(lang: Lang, field: Bilingual | null | undefined, fallback: string | Bilingual): string {
  const raw = field?.[lang]?.trim();
  if (raw) return raw;
  if (typeof fallback === "string") return fallback;
  return fallback[lang]?.trim() || fallback.en || fallback.zh || "";
}
