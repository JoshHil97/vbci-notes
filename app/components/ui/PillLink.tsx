import Link from "next/link";
import type { ReactNode } from "react";

type PillLinkProps = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
};

export default function PillLink({ href, children, isActive }: PillLinkProps) {
  return (
    <Link href={href} className={`vbci-pill ${isActive ? "vbci-pillActive" : ""}`.trim()}>
      {children}
    </Link>
  );
}
