import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: Props) {
  const hasDesc = Boolean(description?.trim());

  return (
    <article className="flex flex-col items-center gap-3 px-2 py-2 text-center">
      {icon}
      <div className="max-w-[180px] space-y-1">
        <h3 className="text-[14px] font-semibold leading-snug tracking-tight text-text sm:text-[15px]">
          {title}
        </h3>
        {hasDesc ? <p className="text-[12px] leading-relaxed text-text-muted">{description}</p> : null}
      </div>
    </article>
  );
}
