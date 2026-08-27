import type { ReactNode } from "react";
import { BookOpen, CircleHelp, CirclePlay, Wrench } from "lucide-react";
import type { ManualType } from "../../types/cms";

const stroke = {
  size: 22,
  strokeWidth: 1.5,
  absoluteStrokeWidth: true,
} as const;

function ManualIconFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/15 bg-gradient-to-b from-accent/[0.07] to-transparent text-accent transition-colors group-hover:border-accent/25"
      aria-hidden
    >
      {children}
    </div>
  );
}

export function renderManualIcon(type: ManualType) {
  switch (type) {
    case "installation":
      return (
        <ManualIconFrame>
          <Wrench {...stroke} />
        </ManualIconFrame>
      );
    case "user_manual":
      return (
        <ManualIconFrame>
          <BookOpen {...stroke} />
        </ManualIconFrame>
      );
    case "faq":
      return (
        <ManualIconFrame>
          <CircleHelp {...stroke} />
        </ManualIconFrame>
      );
    case "video":
      return (
        <ManualIconFrame>
          <CirclePlay {...stroke} />
        </ManualIconFrame>
      );
    default:
      return (
        <ManualIconFrame>
          <BookOpen {...stroke} />
        </ManualIconFrame>
      );
  }
}
