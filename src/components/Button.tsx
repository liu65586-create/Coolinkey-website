import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  variant: Variant;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children">;

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-semibold leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "border border-transparent bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-[rgba(11,27,43,0.14)] bg-white text-text hover:border-accent hover:text-accent",
  ghost: "border border-white/70 bg-white/10 text-white hover:bg-white/20",
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
