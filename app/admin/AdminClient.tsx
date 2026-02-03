"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";
import { supabaseBrowser } from "@/lib/supabase-client";

type PostDraft = {
  id: string;
  title: string;
  slug: string;
  speaker: string | null;
  preached_at: string | null;
  summary: string | null;
  youtube_url: string | null;
  content_json: JSONContent | null;
  published: boolean | null;
};

type Props = {
  initialPost?: PostDraft | null;
};

export default function AdminClient({ initialPost }: Props) {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const isEditing = Boolean(initialPost?.id);

  const initialDate = (() => {
    if (!initialPost?.preached_at) return "";
    const parsed = new Date(initialPost.preached_at);
    if (Number.isNaN(parsed.getTime())) {
      return initialPost.preached_at;
    }
    return parsed.toISOString().slice(0, 10);
  })();

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [speaker, setSpeaker] = useState(initialPost?.speaker ?? "");
  const [date, setDate] = useState(initialDate);
  const [summary, setSummary] = useState(initialPost?.summary ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialPost?.youtube_url ?? "");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialPost?.content_json ?? "",
    immediatelyRender: false,
  });

  async function handleSubmit(published: boolean) {
    if (!editor) return;

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      alert("Title is required");
      return;
    }

    const slug = isEditing
      ? initialPost?.slug ?? slugify(cleanTitle, { lower: true, strict: true })
      : slugify(cleanTitle, { lower: true, strict: true });

    setStatusMessage(null);
    setLoading(true);

    const payload = {
      title: cleanTitle,
      slug,
      speaker: speaker.trim() || null,
      preached_at: date || null,
      summary: summary.trim() || null,
      youtube_url: youtubeUrl.trim() || null,
      content_json: editor.getJSON(),
      published,
    };

    const { error } = isEditing
      ? await supabase.from("posts").update(payload).eq("id", initialPost?.id)
      : await supabase.from("posts").insert(payload);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setStatusMessage(published ? "Published successfully." : "Draft saved.");
    router.push(published ? `/notes/${slug}` : "/admin");
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>
        {isEditing ? "Edit Note" : "New Note"}
      </h1>

      {isEditing ? (
        <p className="text-muted" style={{ marginBottom: 20 }}>
          Editing <strong>{initialPost?.title}</strong> · Slug:{" "}
          <span>{initialPost?.slug}</span>
        </p>
      ) : (
        <p className="text-muted" style={{ marginBottom: 20 }}>
          Create a new weekly note. Save as draft or publish when ready.
        </p>
      )}

      <label>Title</label>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Speaker</label>
      <input
        placeholder="Speaker"
        value={speaker}
        onChange={(e) => setSpeaker(e.target.value)}
      />

      <label>Preached date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label>Summary</label>
      <textarea
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <label>YouTube URL</label>
      <input
        placeholder="YouTube URL (optional)"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <EditorContent editor={editor} />
      </div>

      {statusMessage ? (
        <p className="text-muted" style={{ marginBottom: 12 }}>
          {statusMessage}
        </p>
      ) : null}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          disabled={loading || !title.trim()}
          onClick={() => handleSubmit(false)}
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>

        <button
          disabled={loading || !title.trim()}
          onClick={() => handleSubmit(true)}
        >
          {loading ? "Saving..." : isEditing ? "Publish Changes" : "Publish"}
        </button>
      </div>
    </div>
  );
}
