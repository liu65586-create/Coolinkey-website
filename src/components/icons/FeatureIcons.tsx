import type { FeatureIconKey } from "../../types/siteConfig";

/** Minimal 24×24 viewBox line icons; scaled by parent (e.g. 48px). */
const vb = "0 0 24 24";

/** IP67 / waterproof — single teardrop + base line */
export function IconWater() {
  return (
    <svg width="48" height="48" viewBox={vb} fill="none" aria-hidden className="shrink-0">
      <path
        d="M12 3.5c-3 4.2-5 7.1-5 10.2a5 5 0 1 0 10 0c0-3.1-2-6-5-10.2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M6 20.5h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

/** Fingerprint — concentric arcs + oval pad */
export function IconFingerprint() {
  return (
    <svg width="48" height="48" viewBox={vb} fill="none" aria-hidden className="shrink-0">
      <ellipse cx="12" cy="10" rx="4.5" ry="5.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 16.5c0-1.5 1.3-2.5 4-2.5s4 1 4 2.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M6 11.5a6 6 0 0 1 12 0M7.5 7.5a4.2 4.2 0 0 1 9 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

/** Chain — two interlocking rounded bars */
export function IconChain() {
  return (
    <svg width="48" height="48" viewBox={vb} fill="none" aria-hidden className="shrink-0">
      <rect x="3" y="10" width="8" height="9" rx="2.25" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="5" width="8" height="9" rx="2.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function renderFeatureIcon(key: FeatureIconKey) {
  switch (key) {
    case "fingerprint":
      return <IconFingerprint />;
    case "chain":
      return <IconChain />;
    case "water":
    default:
      return <IconWater />;
  }
}
