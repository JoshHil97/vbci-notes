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

export default function NoteClient({ content }: Props) {
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
