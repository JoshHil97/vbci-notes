import { notFound } from "next/navigation";
import NoteClient from "./NoteClient";
import { supabaseServer } from "../../../lib/supabase-server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = await supabaseServer();

  const { data: post, error } = await supabase
    .from("posts")
    .select("title, speaker, preached_at, youtube_url, content_json")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        {post.title}
      </h1>

      {post.speaker ? (
        <p style={{ opacity: 0.8, marginBottom: 6 }}>{post.speaker}</p>
      ) : null}

      {post.preached_at ? (
        <p style={{ opacity: 0.6, marginBottom: 16 }}>
          {new Date(post.preached_at).toLocaleDateString()}
        </p>
      ) : null}

      <NoteClient content={post.content_json} youtubeUrl={post.youtube_url} />
    </div>
  );
}
