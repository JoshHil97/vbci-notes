import { notFound } from "next/navigation";
import NoteClient from "./NoteClient";
import AdminControls from "../components/AdminControls";
import { supabaseServer } from "../../../lib/supabase-server";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string }>;
};

function getStatusMessage(status?: string) {
  if (status === "published") return "Note published successfully.";
  if (status === "updated") return "Changes published successfully.";
  return null;
}

function formatDisplayDate(value: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export default async function NotePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { status } = await searchParams;

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "title, speaker, preached_at, youtube_url, content_json, summary, published, slug"
    )
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  if (!post.published && !user) {
    notFound();
  }

  const statusMessage = getStatusMessage(status);
  const preachedDate = formatDisplayDate(post.preached_at);

  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in notes-shell">
          {statusMessage ? (
            <div className="status-banner soft-fade-in">{statusMessage}</div>
          ) : null}

          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="note-detail-header">
              <p className="section-kicker">Weekly teaching note</p>

              <h1 className="note-detail-title">{post.title}</h1>

              {post.summary ? (
                <p className="note-detail-summary">{post.summary}</p>
              ) : null}

              <div className="note-detail-meta">
                {post.speaker ? (
                  <span className="note-pill note-pill-soft">
                    Speaker: {post.speaker}
                  </span>
                ) : null}

                {preachedDate ? (
                  <span className="note-pill note-pill-soft">
                    Shared {preachedDate}
                  </span>
                ) : null}

                {!post.published && user ? (
                  <span className="note-pill note-pill-draft">Draft preview</span>
                ) : null}
              </div>
            </div>

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
