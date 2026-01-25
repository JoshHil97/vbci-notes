import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";

const notesDir = path.join(process.cwd(), "content/notes");

export function getAllNotes() {
  const files = fs.readdirSync(notesDir);

  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(notesDir, file), "utf8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? slug,
      speaker: data.speaker ?? "",
      date: data.date ?? "",
      link: data.link ?? "",
      contentHtml: markdownToHtml(content),
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNoteBySlug(slug: string) {
  const fullPath = path.join(notesDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    speaker: data.speaker ?? "",
    date: data.date ?? "",
    link: data.link ?? "",
    contentHtml: markdownToHtml(content),
  };
}
