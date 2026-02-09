"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";
import { supabaseBrowser } from "@/lib/supabase-client";
import TextColorMark from "./TextColorMark";

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

type ToolbarButtonProps = {
  label: string;
  title: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

const COLOR_PRESETS = [
  { label: "Default", value: "" },
  { label: "Black", value: "#111111" },
  { label: "Deep brown", value: "#5c3a1e" },
  { label: "Navy", value: "#1f3a5f" },
  { label: "Forest green", value: "#2f5d3d" },
  { label: "Crimson", value: "#8b1e2d" },
];

function ToolbarButton({
  label,
  title,
  onClick,
  isActive = false,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`editor-button ${isActive ? "is-active" : ""}`}
      title={title}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

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
  const [customColor, setCustomColor] = useState("#111111");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder:
          "Write your note here. Use headings, bullets, links, and color to keep the message clear and professional.",
      }),
      TextColorMark,
    ],
    content: initialPost?.content_json ?? "",
    immediatelyRender: false,
  });

  const activeColor =
    (editor?.getAttributes("textColor").color as string | null | undefined) ??
    "";
  const selectedPresetColor = COLOR_PRESETS.some(
    (color) => color.value === activeColor
  )
    ? activeColor
    : "";

  function handleSetLink() {
    if (!editor) return;

    const existingHref = (editor.getAttributes("link").href as string) ?? "";
    const url = window.prompt("Enter URL", existingHref || "https://");

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

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

      <label>Note content</label>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <div className="editor-shell">
          <div className="editor-toolbar">
            <div className="editor-group">
              <ToolbarButton
                label="Undo"
                title="Undo"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor}
              />
              <ToolbarButton
                label="Redo"
                title="Redo"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor}
              />
            </div>

            <div className="editor-group">
              <ToolbarButton
                label="P"
                title="Paragraph"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                isActive={editor?.isActive("paragraph")}
                disabled={!editor}
              />
              <ToolbarButton
                label="H2"
                title="Heading 2"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editor?.isActive("heading", { level: 2 })}
                disabled={!editor}
              />
              <ToolbarButton
                label="H3"
                title="Heading 3"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                isActive={editor?.isActive("heading", { level: 3 })}
                disabled={!editor}
              />
            </div>

            <div className="editor-group">
              <ToolbarButton
                label="B"
                title="Bold"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                isActive={editor?.isActive("bold")}
                disabled={!editor}
              />
              <ToolbarButton
                label="I"
                title="Italic"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                isActive={editor?.isActive("italic")}
                disabled={!editor}
              />
              <ToolbarButton
                label="U"
                title="Underline"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                isActive={editor?.isActive("underline")}
                disabled={!editor}
              />
              <ToolbarButton
                label="S"
                title="Strikethrough"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                isActive={editor?.isActive("strike")}
                disabled={!editor}
              />
            </div>

            <div className="editor-group">
              <ToolbarButton
                label="Bullets"
                title="Bullet list"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                isActive={editor?.isActive("bulletList")}
                disabled={!editor}
              />
              <ToolbarButton
                label="Numbers"
                title="Ordered list"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                isActive={editor?.isActive("orderedList")}
                disabled={!editor}
              />
              <ToolbarButton
                label="Quote"
                title="Block quote"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                isActive={editor?.isActive("blockquote")}
                disabled={!editor}
              />
            </div>

            <div className="editor-group">
              <ToolbarButton
                label="Link"
                title="Add or edit link"
                onClick={handleSetLink}
                isActive={editor?.isActive("link")}
                disabled={!editor}
              />
              <ToolbarButton
                label="Line"
                title="Insert horizontal line"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                disabled={!editor}
              />
              <ToolbarButton
                label="Clear"
                title="Clear formatting"
                onClick={() =>
                  editor?.chain().focus().unsetAllMarks().clearNodes().run()
                }
                disabled={!editor}
              />
            </div>

            <div className="editor-group">
              <select
                className="editor-select"
                title="Text color presets"
                onChange={(event) => {
                  if (!editor) return;
                  const value = event.target.value;
                  if (!value) {
                    editor.chain().focus().unsetTextColor().run();
                    return;
                  }
                  setCustomColor(value);
                  editor.chain().focus().setTextColor(value).run();
                }}
                value={selectedPresetColor}
                disabled={!editor}
              >
                {COLOR_PRESETS.map((color) => (
                  <option key={color.label} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
              <input
                className="editor-color-input"
                type="color"
                value={customColor}
                title="Pick custom text color"
                onChange={(event) => {
                  if (!editor) return;
                  const value = event.target.value;
                  setCustomColor(value);
                  editor.chain().focus().setTextColor(value).run();
                }}
                disabled={!editor}
              />
              <ToolbarButton
                label="Reset color"
                title="Reset text color"
                onClick={() => editor?.chain().focus().unsetTextColor().run()}
                disabled={!editor}
              />
            </div>
          </div>

          <EditorContent editor={editor} className="editor-surface" />
        </div>
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
