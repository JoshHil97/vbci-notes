import React from "react";

type Verse = {
  ref: string;
  text: string;
};

const VERSES: Verse[] = [
  { ref: "Romans 10:9", text: "If you declare with your mouth, Jesus is Lord, and believe in your heart that God raised Him from the dead, you will be saved." },
  { ref: "Acts 4:12", text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved." },
  { ref: "Ephesians 2:8 to 9", text: "For by grace you have been saved through faith, not by works." },
  { ref: "Titus 3:5", text: "He saved us, not because of righteous things we had done, but because of His mercy." },
  { ref: "John 3:16", text: "For God so loved the world that He gave His one and only Son." },
  { ref: "2 Corinthians 5:17", text: "If anyone is in Christ, the new creation has come." },
  { ref: "Psalm 119:105", text: "Your word is a lamp to my feet and a light to my path." },
  { ref: "Hebrews 4:12", text: "The word of God is living and active." },
  { ref: "Isaiah 55:11", text: "My word will not return to me empty." },
  { ref: "Matthew 4:4", text: "Man shall not live by bread alone." },
  { ref: "1 John 1:9", text: "If we confess our sins, He is faithful and just to forgive." },
  { ref: "Romans 8:1", text: "There is now no condemnation for those who are in Christ Jesus." },
  { ref: "John 14:6", text: "I am the way and the truth and the life." },
  { ref: "Colossians 1:13 to 14", text: "He has rescued us and brought us into the kingdom of the Son." },
  { ref: "1 Peter 2:24", text: "By His wounds you have been healed." },
  { ref: "Galatians 2:20", text: "I have been crucified with Christ and I no longer live." },
  { ref: "Philippians 2:9 to 11", text: "At the name of Jesus every knee should bow." },
];

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
        const v = pick(VERSES, i);

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
              fontWeight: weight as any,
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
