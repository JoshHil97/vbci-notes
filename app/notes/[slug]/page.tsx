import { notFound } from "next/navigation";
import NoteClient from "./NoteClient";
import AdminControls from "../components/AdminControls";
import { supabaseServer } from "../../../lib/supabase-server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select("title, speaker, preached_at, youtube_url, content_json, published, slug")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  if (!post.published && !user) {
    notFound();
  }

  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in" style={{ padding: 24, marginTop: 18 }}>
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

            {user ? (
              <div style={{ marginBottom: 16 }}>
                <AdminControls slug={post.slug} />
              </div>
            ) : null}

            <NoteClient content={post.content_json} youtubeUrl={post.youtube_url} />
          </div>
        </section>
      </main>
    </div>
  );
}
