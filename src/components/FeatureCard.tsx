import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: Props) {
  const hasDesc = Boolean(description?.trim());

  return (
    <article className="flex flex-col items-center gap-5 px-3 py-8 text-center sm:px-5">
      {icon}
      <div className="mx-auto max-w-[280px] space-y-2">
        <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-text sm:text-lg">{title}</h3>
        {hasDesc ? (
          <p className="text-sm leading-relaxed text-text-muted">{description}</p>
        ) : null}
      </div>
    </article>
  );
}
