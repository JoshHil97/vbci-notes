"use client";

import { useEffect, useState } from "react";
import styles from "./VerseCarousel.module.css";
import { SCRIPTURE_VERSES } from "./scripture-verses";

const ROTATION_MS = 7000;

function getWrappedIndex(index: number) {
  const length = SCRIPTURE_VERSES.length;
  return ((index % length) + length) % length;
}

export default function VerseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => getWrappedIndex(currentIndex + 1));
    }, ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const verse = SCRIPTURE_VERSES[activeIndex];

  return (
    <section className={`${styles.shell} crisp-card soft-fade-in`}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Scripture carousel</p>
          <h2 className={styles.title}>Keep the Word in view</h2>
        </div>

        <p className="text-muted">
          A rotating set of verses to sit with after the notes.
        </p>
      </div>

      <article className={styles.card} key={verse.ref}>
        <p className={styles.reference}>{verse.ref}</p>
        <blockquote className={styles.text}>{verse.text}</blockquote>
      </article>

      <div className={styles.footer}>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            onClick={() => setActiveIndex((currentIndex) => getWrappedIndex(currentIndex - 1))}
          >
            Previous
          </button>

          <button
            type="button"
            className={styles.button}
            onClick={() => setActiveIndex((currentIndex) => getWrappedIndex(currentIndex + 1))}
          >
            Next
          </button>
        </div>

        <div className={styles.dots} aria-label="Verse selection">
          {SCRIPTURE_VERSES.map((item, index) => (
            <button
              key={item.ref}
              type="button"
              className={`${styles.dot} ${
                index === activeIndex ? styles.dotActive : ""
              }`.trim()}
              aria-label={`Show ${item.ref}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
