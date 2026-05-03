import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white px-4 py-8 text-center shadow-sm shadow-slate-200/60 sm:px-6">
      <div className="mx-auto mb-0 flex h-[48px] w-[48px] items-center justify-center text-emerald-600">{icon}</div>
      <h3 className="my-4 text-[20px] font-semibold leading-snug text-slate-900">{title}</h3>
      <p className="text-[15px] font-normal leading-[1.5] text-slate-600">{description}</p>
    </article>
  );
}
