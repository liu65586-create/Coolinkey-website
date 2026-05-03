import type { FeatureIconKey } from "../../types/siteConfig";

/** Minimal 24×24 viewBox line icons; scaled by parent (e.g. 48px). */
const vb = "0 0 24 24";

/** IP67 — shield + droplet (protection + water) */
export function IconWater() {
  return (
    <svg width="48" height="48" viewBox={vb} fill="none" aria-hidden className="shrink-0">
      <path
        d="M12 2.4 4.2 5.8v6.1c0 4 2.7 6.9 7.8 8.5 5.1-1.6 7.8-4.5 7.8-8.5V5.8L12 2.4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.2c-1.4 1.9-2.3 3.2-2.3 4.3a2.3 2.3 0 1 0 4.6 0c0-1.1-.9-2.4-2.3-4.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Fingerprint — square sensor pad + scan arcs (matches lock face) */
export function IconFingerprint() {
  return (
    <svg width="48" height="48" viewBox={vb} fill="none" aria-hidden className="shrink-0">
      <rect x="5.75" y="5.75" width="12.5" height="12.5" rx="2.4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M9 9.5c.7-.45 1.75-.7 3-.7s2.3.25 3 .7M8.25 12.25c.85-.6 2.15-.95 3.75-.95s2.9.35 3.75.95M9 15c.9-.65 2.1-1 3-1s2.1.35 3 1"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Chain — two interlocking oval links (sleeved chain silhouette) */
export function IconChain() {
  return (
    <svg width="48" height="48" viewBox={vb} fill="none" aria-hidden className="shrink-0">
      <ellipse
        cx="9"
        cy="12"
        rx="3.5"
        ry="6"
        stroke="currentColor"
        strokeWidth="1.75"
        transform="rotate(-14 9 12)"
      />
      <ellipse
        cx="15"
        cy="12"
        rx="3.5"
        ry="6"
        stroke="currentColor"
        strokeWidth="1.75"
        transform="rotate(14 15 12)"
      />
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
