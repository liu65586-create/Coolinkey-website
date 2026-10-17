/** Keeps the mark inside the 80px nav without cropping or stretching. */
export function clampLogoHeight(value: number | undefined): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 30;
  return Math.min(40, Math.max(16, Math.round(n)));
}
