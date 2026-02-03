import React from "react";

type Props = {
  size?: number;
  title?: string;
  className?: string;
};

export default function BibleIcon({ size = 22, title = "Bible", className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="bibleCover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b2b2b" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
      </defs>

      {/* Book block */}
      <path
        d="M18 10h26c4 0 8 3 8 8v34c0 3-2 5-5 5H22c-2 0-4 1-5 2V14c0-2 0-4 1-4z"
        fill="url(#bibleCover)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
      />
      <path
        d="M18 10h3c3 0 6 2 6 6v41c-2-2-4-2-6-2h-3V10z"
        fill="rgba(255,255,255,0.08)"
      />

      {/* Page edge */}
      <path
        d="M46 14h2c2 0 4 2 4 4v32c0 2-2 4-4 4h-2V14z"
        fill="rgba(255,255,255,0.12)"
      />

      {/* Cross */}
      <path
        d="M34 22h-4v8h-7v4h7v12h4V34h7v-4h-7v-8z"
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  );
}

