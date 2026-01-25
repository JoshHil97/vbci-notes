import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "soft";
  className?: string;
  ariaLabel?: string;
};

export default function GlowButton({
  href,
  children,
  variant = "solid",
  className = "",
  ariaLabel,
}: Props) {
  const base = variant === "soft" ? "vbci-pill vbci-pill-soft" : "vbci-pill";
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={[
        base,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(164,107,255,0.55)] focus-visible:ring-offset-0",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
