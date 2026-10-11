/**
 * Minimal inline SVG icon set. Stroke-based, 1.6px, currentColor — tuned to
 * read cleanly at small sizes in the popup.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const SearchIcon = (p: IconProps) => (
  <svg {...base({ size: 14, ...p })}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base({ size: 12, ...p })} strokeWidth={2.4}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base({ size: 15, ...p })}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base({ size: 18, ...p })}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const StarIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base({ size: 15, ...p })} fill={filled ? "currentColor" : "none"}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 20.6l1-5.8L3.5 9.7l5.9-.9z" />
  </svg>
);

export const ExternalIcon = (p: IconProps) => (
  <svg {...base({ size: 14, ...p })}>
    <path d="M14 4h6v6M20 4l-8 8M18 13v6H5V6h6" />
  </svg>
);

export const LinkIcon = (p: IconProps) => (
  <svg {...base({ size: 14, ...p })}>
    <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
  </svg>
);

export const TabIcon = (p: IconProps) => (
  <svg {...base({ size: 14, ...p })}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18" />
  </svg>
);

export const InboxIcon = (p: IconProps) => (
  <svg {...base({ size: 24, ...p })}>
    <path d="M4 13h4l2 3h4l2-3h4" />
    <path d="M6 6h12l3 7v5H3v-5z" />
  </svg>
);
