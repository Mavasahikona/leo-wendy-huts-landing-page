import type { SVGProps } from 'react';

export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <path d="M3 18.5 20 5l17 13.5v5L20 10 3 23.5v-5Z" fill="currentColor" />
      <path d="m7 24 13-10 13 10v4L20 18 7 28v-4Z" fill="currentColor" />
      <path d="M7 30h11v5H7v-5Zm15-7h5v12h-5V23Zm7 7h4v5h-4v-5Z" fill="currentColor" />
    </svg>
  );
}

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a href="#" className={`brand${footer ? ' brand-footer' : ''}`} aria-label="Leo Wendy Huts home">
      <LogoMark className="brand-mark" />
      <span>leo wendy huts<span className="brand-period">.</span></span>
    </a>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z" />
      <path d="m8.1 7.6 1.2-.2 1.2 2.5-.9 1.1c.7 1.4 1.6 2.3 3.1 3l1.1-.9 2.5 1.2-.2 1.2c-.2 1-1.3 1.5-2.3 1.2-3.4-.9-6.3-3.8-7.1-7.1-.2-.9.4-1.8 1.4-2Z" strokeWidth="1.35" />
    </svg>
  );
}