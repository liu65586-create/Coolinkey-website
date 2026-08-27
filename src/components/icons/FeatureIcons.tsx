import { Fingerprint, Link2, ShieldCheck } from "lucide-react";
import type { FeatureIconKey } from "../../types/siteConfig";

type FrameProps = {
  children: React.ReactNode;
};

/** Shared frame — same footprint & optical weight for all three features. */
function FeatureIconFrame({ children }: FrameProps) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/15 bg-gradient-to-b from-accent/[0.07] to-transparent text-accent"
      aria-hidden
    >
      {children}
    </div>
  );
}

const stroke = {
  size: 22,
  strokeWidth: 1.5,
  absoluteStrokeWidth: true,
} as const;

/** IP67 — protection certified (Lucide ShieldCheck, used on premium IoT/security UIs). */
function IconProtection() {
  return <ShieldCheck {...stroke} />;
}

/** Biometric unlock — Lucide Fingerprint. */
function IconBiometric() {
  return <Fingerprint {...stroke} />;
}

/** Heavy-duty chain — Lucide Link2 (interlocking links, hardware catalog style). */
function IconChainLinks() {
  return <Link2 {...stroke} />;
}

export function renderFeatureIcon(key: FeatureIconKey) {
  switch (key) {
    case "fingerprint":
      return (
        <FeatureIconFrame>
          <IconBiometric />
        </FeatureIconFrame>
      );
    case "chain":
      return (
        <FeatureIconFrame>
          <IconChainLinks />
        </FeatureIconFrame>
      );
    case "water":
    default:
      return (
        <FeatureIconFrame>
          <IconProtection />
        </FeatureIconFrame>
      );
  }
}
