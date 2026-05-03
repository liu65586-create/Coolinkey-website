import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: Props) {
  return (
    <article className="bg-[#0a0a0a] px-2 py-2 text-center sm:px-4">
      <div className="mx-auto mb-0 flex h-[48px] w-[48px] items-center justify-center text-[#00e676]">{icon}</div>
      <h3 className="my-4 text-[20px] font-semibold leading-snug text-white">{title}</h3>
      <p className="text-[15px] font-normal leading-[1.5] text-[#cccccc]">{description}</p>
    </article>
  );
}
