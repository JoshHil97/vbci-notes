import styles from "./VerseCarousel.module.css";
import { SCRIPTURE_VERSES } from "./scripture-verses";

const REPEATED_VERSES = [...SCRIPTURE_VERSES, ...SCRIPTURE_VERSES];

export default function VerseCarousel() {
  return (
    <aside className={styles.shell} aria-label="Scripture verse rail">
      <div className={styles.track}>
        {REPEATED_VERSES.map((verse, index) => (
          <p
            key={`${verse.ref}-${index}`}
            className={styles.item}
            aria-hidden={index >= SCRIPTURE_VERSES.length}
          >
            <span className={styles.reference}>{verse.ref}</span>
            <span className={styles.separator} />
            <span className={styles.text}>{verse.text}</span>
          </p>
        ))}
      </div>
    </aside>
  );
}
