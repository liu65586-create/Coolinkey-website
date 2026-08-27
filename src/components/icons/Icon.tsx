import type { ReactNode, SVGProps } from "react";

type Props = {
  children: ReactNode;
  size?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "ref">;

/** Unified stroke icon — 24×24 viewBox, 1.75px stroke. */
export function Icon({ children, size = 24, className = "", ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`shrink-0 ${className}`.trim()}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconShield({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <path d="M12 3 4.5 6v5.4c0 4.2 3 7.4 7.5 9 4.5-1.6 7.5-4.8 7.5-9V6L12 3Z" />
      <path d="M12 8.5c-1.2 1.6-2 2.8-2 3.8a2 2 0 1 0 4 0c0-1-.8-2.2-2-3.8Z" />
    </Icon>
  );
}

export function IconFingerprint({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <path d="M9 9.5c.6-.4 1.5-.65 2.5-.65s1.9.25 2.5.65M8.5 12.25c.75-.55 1.85-.9 3.25-.9s2.5.35 3.25.9M9 15c.8-.6 1.9-.95 3-.95s2.2.35 3 .95" />
    </Icon>
  );
}

export function IconLink({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <path d="M9 12a4 4 0 0 1 6.5-3.1l1.4 1.4a4 4 0 0 1-5.6 5.6l-1-1" />
      <path d="M15 12a4 4 0 0 1-6.5 3.1L7.1 13.7a4 4 0 0 1 5.6-5.6l1 1" />
    </Icon>
  );
}

export function IconFileText({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <path d="M8 4h7l5 5v11H8V4Z" />
      <path d="M15 4v5h5M10 13h6M10 17h6" />
    </Icon>
  );
}

export function IconPlay({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m10.5 9 6 3-6 3V9Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconChevronLeft({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <path d="m14 6-6 6 6 6" />
    </Icon>
  );
}

export function IconChevronRight({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <path d="m10 6 6 6-6 6" />
    </Icon>
  );
}

export function IconMenu({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function IconClose({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <Icon size={size} className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Icon>
  );
}
