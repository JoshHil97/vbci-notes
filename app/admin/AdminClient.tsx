"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function AdminClient() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
  });

  async function handleSubmit() {
    if (!editor) return;

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      alert("Title is required");
      return;
    }

    const slug = slugify(cleanTitle, { lower: true, strict: true });

    setLoading(true);

    const { error } = await supabase.from("posts").insert({
      title: cleanTitle,
      slug,
      speaker: speaker.trim() || null,
      preached_at: date || null,
      summary: summary.trim() || null,
      youtube_url: youtubeUrl.trim() || null,
      content_json: editor.getJSON(),
      published: true,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/notes");
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>Admin</h1>

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

      <button disabled={loading || !title.trim()} onClick={handleSubmit}>
        {loading ? "Saving..." : "Create post"}
      </button>
    </div>
  );
}
