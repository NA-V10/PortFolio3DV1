import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ArrowDown = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M8 2v11M4 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const GitHub = (p: P) => (
  <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden {...p}>
    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);
export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor" aria-hidden {...p}>
    <path d="M13.63 13.63h-2.37V9.92c0-.89-.02-2.03-1.24-2.03-1.24 0-1.43.97-1.43 1.96v3.78H6.22V6h2.28v1.04h.03c.32-.6 1.09-1.24 2.25-1.24 2.4 0 2.85 1.58 2.85 3.64v4.19zM3.54 4.96a1.38 1.38 0 110-2.75 1.38 1.38 0 010 2.75zm1.19 8.67H2.36V6h2.37v7.63zM14.81 0H1.18C.53 0 0 .52 0 1.15v13.7C0 15.48.53 16 1.18 16h13.63c.65 0 1.19-.52 1.19-1.15V1.15C16 .52 15.46 0 14.81 0z" />
  </svg>
);
