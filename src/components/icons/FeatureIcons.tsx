import {
  BatteryCharging,
  ClipboardList,
  Droplets,
  Fingerprint,
  KeyRound,
  Link2,
  Share2,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import type { FeatureIconKey } from "../../types/siteConfig";

type FrameProps = {
  children: ReactNode;
};

function FeatureIconFrame({ children }: FrameProps) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8ea] text-accent"
      aria-hidden
    >
      {children}
    </div>
  );
}

const stroke = {
  size: 22,
  strokeWidth: 1.75,
  absoluteStrokeWidth: true,
} as const;

export function renderFeatureIcon(key: FeatureIconKey) {
  const icon =
    key === "fingerprint" ? (
      <Fingerprint {...stroke} />
    ) : key === "dual" ? (
      <KeyRound {...stroke} />
    ) : key === "share" ? (
      <Share2 {...stroke} />
    ) : key === "logs" ? (
      <ClipboardList {...stroke} />
    ) : key === "battery" ? (
      <BatteryCharging {...stroke} />
    ) : key === "chain" ? (
      <Link2 {...stroke} />
    ) : key === "water" ? (
      <Droplets {...stroke} />
    ) : (
      <ShieldCheck {...stroke} />
    );

  return <FeatureIconFrame>{icon}</FeatureIconFrame>;
}
