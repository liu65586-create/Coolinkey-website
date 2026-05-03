import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

type Props = {
  variant: Variant;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children">;

const base =
  "inline-flex cursor-pointer items-center justify-center rounded-[8px] px-8 py-3 text-[16px] font-semibold leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "border-2 border-transparent bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-700",
  secondary:
    "border-2 border-emerald-600 bg-white text-emerald-800 hover:bg-emerald-50 active:bg-emerald-50",
};

export function Button({ variant, children, onClick, href, className = "", ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`.trim();
  if (href) {
    return (
      <a className={cls} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
