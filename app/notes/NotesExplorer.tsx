"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";

type NoteListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  speaker: string | null;
  youtube_url: string | null;
  preached_at: string | null;
  created_at: string | null;
  published: boolean | null;
};

type NotesExplorerProps = {
  notes: NoteListItem[];
  isAdmin: boolean;
};

type SortDirection = "newest" | "oldest";

const absoluteDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const relativeDateFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

function toTimestamp(value: string | null) {
  if (!value) return 0;

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatAbsoluteDate(value: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return absoluteDateFormatter.format(parsed);
}

function formatRelativeDate(value: string | null) {
  if (!value) return null;

  const timestamp = toTimestamp(value);
  if (!timestamp) return null;

  const diffInSeconds = Math.round((timestamp - Date.now()) / 1000);
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

function getSearchText(note: NoteListItem) {
  return [note.title, note.speaker, note.summary]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getPrimaryTimestamp(note: NoteListItem) {
  return toTimestamp(note.preached_at) || toTimestamp(note.created_at);
}

export default function NotesExplorer({
  notes,
  isAdmin,
}: NotesExplorerProps) {
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("newest");
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredNotes = notes.filter((note) => {
    if (!normalizedSearch) return true;
    return getSearchText(note).includes(normalizedSearch);
  });

  filteredNotes.sort((left, right) => {
    const leftTimestamp = getPrimaryTimestamp(left);
    const rightTimestamp = getPrimaryTimestamp(right);

    if (sortDirection === "oldest") {
      return leftTimestamp - rightTimestamp;
    }

    return rightTimestamp - leftTimestamp;
  });

  const publishedCount = notes.filter((note) => note.published).length;
  const draftCount = notes.length - publishedCount;
  const hasSearch = normalizedSearch.length > 0;

  return (
    <div className="notes-explorer">
      <div className="notes-toolbar">
        <div className="notes-search">
          <label className="notes-field-label" htmlFor="notes-search">
            Search notes
          </label>
          <input
            id="notes-search"
            className="notes-search-input"
            type="search"
            placeholder="Search by title, speaker, or summary"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div>
          <p className="notes-field-label" style={{ marginBottom: 8 }}>
            Sort order
          </p>
          <div className="notes-sort-group" role="group" aria-label="Sort notes">
            <button
              type="button"
              className={`notes-sort-button ${
                sortDirection === "newest" ? "is-active" : ""
              }`.trim()}
              onClick={() => setSortDirection("newest")}
            >
              Newest first
            </button>
            <button
              type="button"
              className={`notes-sort-button ${
                sortDirection === "oldest" ? "is-active" : ""
              }`.trim()}
              onClick={() => setSortDirection("oldest")}
            >
              Oldest first
            </button>
          </div>
        </div>
      </div>

      <p className="text-muted notes-results">
        Showing {filteredNotes.length} of {notes.length} notes
        {hasSearch ? ` for "${deferredSearch.trim()}"` : ""}.
        {isAdmin && draftCount > 0 ? ` ${draftCount} draft notes are private.` : ""}
      </p>

      {filteredNotes.length ? (
        <div className="notes-grid">
          {filteredNotes.map((note, index) => {
            const sharedDate = formatAbsoluteDate(note.preached_at);
            const createdDate = formatAbsoluteDate(note.created_at);
            const relativeCreatedDate = formatRelativeDate(note.created_at);
            const thumbnailUrl = note.youtube_url
              ? getYouTubeThumbnailUrl(note.youtube_url)
              : null;

            return (
              <article
                key={note.id}
                className="note-card soft-fade-in"
                style={{ animationDelay: `${Math.min(index * 70, 280)}ms` }}
              >
                {thumbnailUrl ? (
                  <Link
                    href={`/notes/${note.slug}`}
                    className="note-card-media"
                    aria-label={`Open ${note.title}`}
                  >
                    <img
                      className="note-card-thumbnail"
                      src={thumbnailUrl}
                      alt={`${note.title} video thumbnail`}
                      loading="lazy"
                    />
                    <span className="note-card-play">Watch message</span>
                  </Link>
                ) : null}

                <div className="note-card-header">
                  <div className="note-card-status">
                    <span className="note-card-eyebrow">
                      Weekly teaching note
                    </span>
                    {!note.published && isAdmin ? (
                      <span className="note-pill note-pill-draft">Draft</span>
                    ) : null}
                  </div>

                  <h2 className="note-card-title">
                    <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                  </h2>

                  {note.summary ? (
                    <p className="note-card-summary">{note.summary}</p>
                  ) : (
                    <p className="note-card-summary is-placeholder">
                      Read the full note to revisit the teaching structure,
                      scripture, and key points.
                    </p>
                  )}
                </div>

                <dl className="note-meta">
                  {note.speaker ? (
                    <div className="note-meta-item note-meta-item-speaker">
                      <dt>Speaker</dt>
                      <dd>{note.speaker}</dd>
                    </div>
                  ) : null}

                  {sharedDate ? (
                    <div className="note-meta-item note-meta-item-shared">
                      <dt>Shared</dt>
                      <dd>{sharedDate}</dd>
                    </div>
                  ) : null}

                  {createdDate ? (
                    <div className="note-meta-item note-meta-item-added">
                      <dt>Added</dt>
                      <dd>{createdDate}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="note-card-footer">
                  <span className="text-muted" suppressHydrationWarning>
                    {relativeCreatedDate
                      ? `Added ${relativeCreatedDate}`
                      : "Ready to read"}
                  </span>

                  <Link className="note-card-link" href={`/notes/${note.slug}`}>
                    Read note
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="note-empty">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            No notes match that search
          </h2>
          <p className="text-muted">
            Try a simpler title, speaker, or summary keyword to bring the list
            back into focus.
          </p>
        </div>
      )}
    </div>
  );
}
