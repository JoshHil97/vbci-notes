"use client";

import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";
import { useEffect } from "react";
import TextColorMark from "@/app/admin/TextColorMark";

type Props = {
  content: JSONContent | null;
  youtubeUrl?: string | null;
};

type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function extractText(content: JSONContent[] | undefined): string {
  if (!content?.length) return "";

  return content
    .map((node) => {
      if (node.type === "text") {
        return node.text ?? "";
      }

      if (node.type === "hardBreak") {
        return " ";
      }

      return extractText(node.content);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(text: string, index: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base ? `section-${base}` : `section-${index + 1}`;
}

function extractHeadings(content: JSONContent | null): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const slugCounts = new Map<string, number>();

  function visit(node: JSONContent | null | undefined) {
    if (!node) return;

    const level = node.attrs?.level;
    if (
      node.type === "heading" &&
      (level === 2 || level === 3)
    ) {
      const text = extractText(node.content);
      if (text) {
        const baseId = slugifyHeading(text, headings.length);
        const count = slugCounts.get(baseId) ?? 0;
        slugCounts.set(baseId, count + 1);

        headings.push({
          id: count ? `${baseId}-${count + 1}` : baseId,
          text,
          level,
        });
      }
    }

    node.content?.forEach((child) => visit(child));
  }

  visit(content);

  return headings;
}

function toEmbedUrl(url: string) {
  // Accepts full YouTube URLs and converts to embed
  // If it is already an embed URL, it returns it unchanged
  try {
    if (url.includes("youtube.com/embed/")) return url;

    const u = new URL(url);

    // https://www.youtube.com/watch\?v\=VIDEOID
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;

    // https://youtu.be/VIDEOID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // https://www.youtube.com/live/VIDEOID
    if (u.pathname.startsWith("/live/")) {
      const id = u.pathname.split("/live/")[1]?.split(/[/?#]/)[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  } catch {
    return url;
  }
}

export default function NoteClient({ content, youtubeUrl }: Props) {
  const headings = extractHeadings(content);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextColorMark,
    ],
    content: content ?? "",
    editable: false,
    immediatelyRender: false,
  });

  const embedSrc = youtubeUrl ? toEmbedUrl(youtubeUrl) : null;

  useEffect(() => {
    if (!editor) return;

    const headingElements = Array.from(
      editor.view.dom.querySelectorAll("h2, h3")
    );

    headingElements.forEach((element, index) => {
      const heading = headings[index];
      if (!heading) return;
      element.id = heading.id;
    });
  }, [editor, headings]);

  return (
    <div className="note-reading-stack">
      {embedSrc ? (
        <section className="note-media-card">
          <div className="note-video-frame">
            <iframe
              src={embedSrc}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}

      <div className={`note-reader-layout ${headings.length ? "" : "is-single-column"}`.trim()}>
        {headings.length ? (
          <aside className="note-outline" aria-label="Note sections">
            <p className="section-kicker">In this note</p>
            <nav className="note-outline-nav">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  className={`note-outline-link ${
                    heading.level === 3 ? "is-subsection" : ""
                  }`.trim()}
                  href={`#${heading.id}`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </aside>
        ) : null}

        <article className="note-article">
          <EditorContent editor={editor} className="note-prose" />
        </article>
      </div>
    </div>
  );
}
