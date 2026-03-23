import React from "react";
import { SCRIPTURE_VERSES } from "./scripture-verses";

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

/* Deterministic pseudo random so it is stable on every reload */
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function ScriptureCollage({
  density = 220,
  darkness = 0.16,
}: {
  density?: number;
  darkness?: number;
}) {
  const items = Array.from({ length: density }, (_, i) => i);

  /* Distribute across a loose grid, then jitter each cell.
     This avoids the diagonal stripe pattern completely. */
  const cols = 10;
  const rows = Math.ceil(density / cols);

  return (
    <div aria-hidden className="scripture-collage">
      {items.map((i) => {
        const v = pick(SCRIPTURE_VERSES, i);

        const r = prng(i + 1);

        const col = i % cols;
        const row = Math.floor(i / cols);

        const cellW = 100 / cols;
        const cellH = 100 / rows;

        const jitterX = (r() - 0.5) * cellW * 0.9;
        const jitterY = (r() - 0.5) * cellH * 0.9;

        const left = col * cellW + cellW / 2 + jitterX;
        const top = row * cellH + cellH / 2 + jitterY;

        const rotate = (r() * 14 - 7);
        const size = 10 + Math.floor(r() * 7);
        const weight = 400 + Math.floor(r() * 3) * 100;

        const o = Math.min(0.30, Math.max(0.10, darkness + (r() * 0.14)));

        return (
          <div
            key={i}
            className="scripture-collage-item"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
              opacity: o,
              fontSize: `${size}px`,
              fontWeight: weight as React.CSSProperties["fontWeight"],
              color: "rgba(17, 17, 17, 1)",
            }}
          >
            <span className="ref">{v.ref}</span>{" "}
            <span className="txt">{v.text}</span>
          </div>
        );
      })}
    </div>
  );
}
