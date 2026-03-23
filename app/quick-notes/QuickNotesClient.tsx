"use client";

import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import styles from "./QuickNotesClient.module.css";

type NoteTag = "idea" | "todo" | "reminder";

type QuickNote = {
  id: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "vbci.quick-notes";

const TAG_OPTIONS: Array<{
  value: NoteTag;
  label: string;
  description: string;
}> = [
  {
    value: "idea",
    label: "Idea",
    description: "Loose thoughts, sparks, and directions worth revisiting.",
  },
  {
    value: "todo",
    label: "Todo",
    description: "Tasks and follow-ups you want to keep in sight.",
  },
  {
    value: "reminder",
    label: "Reminder",
    description: "Small things you do not want to drop.",
  },
];

const absoluteDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const relativeDateFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortNotes(notes: QuickNote[]) {
  return [...notes].sort(
    (left, right) => getTimestamp(right.updatedAt) - getTimestamp(left.updatedAt)
  );
}

function readStoredNotes() {
  if (typeof window === "undefined") return [] as QuickNote[];

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return [] as QuickNote[];

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [] as QuickNote[];

    return sortNotes(
      parsed.filter((item): item is QuickNote => {
        if (!item || typeof item !== "object") return false;

        const note = item as Partial<QuickNote>;
        return (
          typeof note.id === "string" &&
          typeof note.content === "string" &&
          typeof note.createdAt === "string" &&
          typeof note.updatedAt === "string" &&
          (note.tag === "idea" || note.tag === "todo" || note.tag === "reminder")
        );
      })
    );
  } catch {
    return [] as QuickNote[];
  }
}

function writeStoredNotes(notes: QuickNote[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  window.dispatchEvent(new Event("quick-notes-storage"));
}

function subscribeToStoredNotes(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorage(event: Event) {
    if (event instanceof StorageEvent && event.key && event.key !== STORAGE_KEY) {
      return;
    }

    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener("quick-notes-storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("quick-notes-storage", handleStorage);
  };
}

function updateStoredNotes(update: (currentNotes: QuickNote[]) => QuickNote[]) {
  const nextNotes = sortNotes(update(readStoredNotes()));
  writeStoredNotes(nextNotes);
}

function formatRelativeDate(value: string, now: number) {
  const diffInSeconds = Math.round((getTimestamp(value) - now) / 1000);
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  for (const [unit, seconds] of ranges) {
    if (Math.abs(diffInSeconds) >= seconds) {
      return relativeDateFormatter.format(
        Math.round(diffInSeconds / seconds),
        unit
      );
    }
  }

  return "just now";
}

function formatAbsoluteDate(value: string) {
  return absoluteDateFormatter.format(new Date(value));
}

function getTagLabel(tag: NoteTag) {
  return TAG_OPTIONS.find((option) => option.value === tag)?.label ?? tag;
}

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 720px)").matches;
}

export default function QuickNotesClient() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [draft, setDraft] = useState("");
  const [activeTag, setActiveTag] = useState<NoteTag>("idea");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "Stored locally in this browser."
  );
  const [animatedNoteId, setAnimatedNoteId] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const notes = useSyncExternalStore(
    subscribeToStoredNotes,
    readStoredNotes,
    () => [] as QuickNote[]
  );

  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  function focusComposer() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const end = textarea.value.length;
    textarea.setSelectionRange(end, end);
  }

  useEffect(() => {
    if (isMobileViewport()) return;

    window.requestAnimationFrame(() => {
      focusComposer();
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [hydrated]);

  useEffect(() => {
    if (!animatedNoteId) return;

    const timeoutId = window.setTimeout(() => {
      setAnimatedNoteId(null);
    }, 420);

    return () => window.clearTimeout(timeoutId);
  }, [animatedNoteId]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 260)}px`;
  }, [draft]);

  useEffect(() => {
    if (!hydrated) return;

    function focusTextareaFromShortcut() {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.focus();
      const end = textarea.value.length;
      textarea.setSelectionRange(end, end);
    }

    function handleShortcut(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isEditableTarget =
        !!target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if (isEditableTarget) return;

      if (event.key === "/" || event.key.toLowerCase() === "n") {
        event.preventDefault();
        focusTextareaFromShortcut();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [hydrated]);

  const filteredNotes = notes.filter((note) => {
    if (!normalizedSearch) return true;

    return [note.content, getTagLabel(note.tag)]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  function submitNote() {
    const content = draft.trim();
    if (!content) return;

    const nowIso = new Date().toISOString();

    if (editingId) {
      updateStoredNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                content,
                tag: activeTag,
                updatedAt: nowIso,
              }
            : note
        )
      );

      setStatusMessage("Note updated.");
      setAnimatedNoteId(editingId);
    } else {
      const noteId = generateId();

      updateStoredNotes((currentNotes) => [
        {
          id: noteId,
          content,
          tag: activeTag,
          createdAt: nowIso,
          updatedAt: nowIso,
        },
        ...currentNotes,
      ]);

      setStatusMessage("Saved.");
      setAnimatedNoteId(noteId);
    }

    setDraft("");
    setEditingId(null);
    setNow(Date.now());

    if (!isMobileViewport()) {
      focusComposer();
    }
  }

  function beginEditing(note: QuickNote) {
    setDraft(note.content);
    setActiveTag(note.tag);
    setEditingId(note.id);
    setStatusMessage("Editing selected note.");

    window.requestAnimationFrame(() => {
      focusComposer();
    });
  }

  function deleteNote(noteId: string) {
    if (removingIds.includes(noteId)) return;

    setRemovingIds((currentIds) =>
      currentIds.includes(noteId) ? currentIds : [...currentIds, noteId]
    );

    if (editingId === noteId) {
      setEditingId(null);
      setDraft("");
      setStatusMessage("Note deleted. Composer cleared.");
    } else {
      setStatusMessage("Note deleted.");
    }

    window.setTimeout(() => {
      updateStoredNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId)
      );

      setRemovingIds((currentIds) => currentIds.filter((id) => id !== noteId));
      setNow(Date.now());
    }, 190);
  }

  function handleComposerKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitNote();
    }
  }

  const activeTagDescription =
    TAG_OPTIONS.find((tag) => tag.value === activeTag)?.description ?? "";
  const noteCountLabel = notes.length === 1 ? "1 note" : `${notes.length} notes`;
  const visibleCountLabel =
    filteredNotes.length === 1 ? "1 result" : `${filteredNotes.length} results`;
  const showEmptyState = hydrated && notes.length === 0;
  const showSearchEmptyState = hydrated && notes.length > 0 && filteredNotes.length === 0;

  return (
    <section className={styles.shell}>
      <div className={`${styles.hero} crisp-card soft-fade-in`}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Micro product</p>
          <h1 className={`heading-cursive ${styles.title}`}>Quick Notes</h1>
          <p className={styles.subtitle}>
            Capture thoughts instantly. No friction. Just write and save.
          </p>
          <p className="text-muted">
            Built for short ideas, reminders, and tasks you want to keep close
            without opening a heavy notes app.
          </p>
        </div>

        <div className={styles.heroMeta}>
          <span className={styles.metaPill}>Stored locally in your browser</span>
          <span className={styles.metaPill}>
            {'Press "/" or "n" to focus'}
          </span>
          <span className={styles.metaPill}>Shift + Enter for a new line</span>
        </div>
      </div>

      <div className={styles.workspace}>
        <section className={`${styles.composer} crisp-card soft-fade-in`}>
          <div className={styles.composerHeader}>
            <div>
              <p className={styles.panelEyebrow}>
                {editingId ? "Update note" : "New note"}
              </p>
              <h2 className={styles.panelTitle}>
                {editingId ? "Edit your draft" : "Write a quick thought"}
              </h2>
            </div>

            <p className="text-muted">
              Press Enter to save. Keep it short, clear, and useful.
            </p>
          </div>

          <div className={styles.tagPicker}>
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag.value}
                type="button"
                className={`${styles.tagButton} ${
                  activeTag === tag.value ? styles.tagButtonActive : ""
                }`.trim()}
                onClick={() => setActiveTag(tag.value)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <p className="text-muted" style={{ minHeight: 44 }}>
            {activeTagDescription}
          </p>

          <label className={styles.srOnly} htmlFor="quick-note-input">
            Quick note text
          </label>
          <textarea
            id="quick-note-input"
            ref={textareaRef}
            className={styles.textarea}
            placeholder="Write a quick note..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            rows={4}
          />

          <div className={styles.composerFooter}>
            <p className={styles.status} aria-live="polite">
              {statusMessage}
            </p>

            <div className={styles.composerActions}>
              {editingId ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setEditingId(null);
                    setDraft("");
                    setStatusMessage("Edit cancelled.");

                    if (!isMobileViewport()) {
                      focusComposer();
                    }
                  }}
                >
                  Cancel
                </button>
              ) : null}

              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => submitNote()}
                disabled={!draft.trim()}
              >
                {editingId ? "Update note" : "Save note"}
              </button>
            </div>
          </div>
        </section>

        <section className={`${styles.feed} crisp-card soft-fade-in`}>
          <div className={styles.feedHeader}>
            <div>
              <p className={styles.panelEyebrow}>Latest notes</p>
              <h2 className={styles.panelTitle}>Newest first</h2>
            </div>

            <div className={styles.feedSummary}>
              <span>{noteCountLabel}</span>
              <span>{visibleCountLabel}</span>
            </div>
          </div>

          <label className={styles.srOnly} htmlFor="quick-note-search">
            Search notes
          </label>
          <input
            id="quick-note-search"
            type="search"
            className={styles.searchInput}
            placeholder="Search your notes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className={styles.feedBody}>
            {!hydrated ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>Loading notes...</h3>
                <p className="text-muted">
                  Pulling your saved notes from this browser.
                </p>
              </div>
            ) : null}

            {showEmptyState ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>No notes yet</h3>
                <p className="text-muted">
                  Start by writing your first thought in the composer on the left.
                </p>
              </div>
            ) : null}

            {showSearchEmptyState ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>No notes match that search</h3>
                <p className="text-muted">
                  Try a simpler phrase or search by tag such as idea, todo, or
                  reminder.
                </p>
              </div>
            ) : null}

            {hydrated && filteredNotes.length ? (
              <div className={styles.noteList}>
                {filteredNotes.map((note) => {
                  const isRemoving = removingIds.includes(note.id);
                  const isAnimating = animatedNoteId === note.id;
                  const wasEdited = note.updatedAt !== note.createdAt;

                  return (
                    <article
                      key={note.id}
                      className={`${styles.noteCard} ${
                        isAnimating ? styles.noteCardEntering : ""
                      } ${isRemoving ? styles.noteCardRemoving : ""}`.trim()}
                    >
                      <div className={styles.noteCardHeader}>
                        <span className={styles.noteTag}>{getTagLabel(note.tag)}</span>
                        <div className={styles.noteActions}>
                          <button
                            type="button"
                            className={styles.cardButton}
                            onClick={() => beginEditing(note)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.cardButton}
                            onClick={() => deleteNote(note.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className={styles.noteContent}>{note.content}</p>

                      <div className={styles.noteMeta}>
                        <span>{wasEdited ? "Updated" : "Saved"} {formatRelativeDate(note.updatedAt, now)}</span>
                        <span>{formatAbsoluteDate(note.updatedAt)}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
