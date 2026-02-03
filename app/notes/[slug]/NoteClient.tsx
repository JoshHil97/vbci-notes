"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

type Props = {
  content: JSONContent | null;
  youtubeUrl?: string | null;
};

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
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? "",
    editable: false,
    immediatelyRender: false,
  });

  const embedSrc = youtubeUrl ? toEmbedUrl(youtubeUrl) : null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {embedSrc ? (
        <div style={{ marginBottom: 16 }}>
          <iframe
            width="100%"
            height="450"
            src={embedSrc}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
