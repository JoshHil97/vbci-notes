import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return <div className={`vbci-card ${className}`.trim()}>{children}</div>;
}
