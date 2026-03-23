import Link from "next/link";
import ScriptureCollage from "@/app/components/ScriptureCollage";
import AdminControls from "@/app/components/AdminControls";
import { supabaseServer } from "@/lib/supabase-server";
import NotesExplorer from "./NotesExplorer";

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  speaker: string | null;
  youtube_url: string | null;
  preached_at: string | null;
  created_at: string | null;
  published: boolean | null;
};

export default async function NotesPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const baseQuery = supabase
    .from("posts")
    .select(
      "id, title, slug, summary, speaker, youtube_url, preached_at, created_at, published"
    )
    .order("created_at", { ascending: false });

  const { data: notes } = user
    ? await baseQuery
    : await baseQuery.eq("published", true);

  const typedNotes = (notes ?? []) as PostListItem[];
  const publishedCount = typedNotes.filter((note) => note.published).length;
  const draftCount = typedNotes.length - publishedCount;

  return (
    <div className="paper-page">
      <ScriptureCollage />

      <main className="container-narrow notes-page-main">
        <section className="crisp-card soft-fade-in notes-shell">
          <div className="notes-hero">
            <p className="section-kicker">Oil for the Journey</p>

            <h1 className="heading-cursive notes-title">Weekly Notes</h1>

            <p className="notes-intro">
              A scripture-first archive for revisiting weekly teaching,
              reflection, and study notes.
            </p>

            <p className="text-muted notes-context">
              Published notes are easy to browse here, while drafts stay private
              until they are ready to be shared.
            </p>

            <div className="notes-badges">
              <span className="note-pill note-pill-soft">
                {publishedCount} published
              </span>
              {user ? (
                <span className="note-pill note-pill-soft">
                  {draftCount} drafts
                </span>
              ) : null}
            </div>
          </div>

          {user ? (
            <div style={{ marginBottom: 20 }}>
              <AdminControls />
            </div>
          ) : null}

          <NotesExplorer notes={typedNotes} isAdmin={Boolean(user)} />

          {!typedNotes.length ? (
            <p className="text-muted" style={{ marginTop: 18 }}>
              Looking for the purpose of this space? Start at{" "}
              <Link className="nav-link" href="/">
                Home
              </Link>{" "}
              for the wider context of the project.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
