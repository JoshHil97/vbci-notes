import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import DeleteNoteForm from "./DeleteNoteForm";

type PostSummary = {
  id: string;
  title: string;
  slug: string;
  published: boolean | null;
  created_at: string | null;
};

type AdminPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function getStatusMessage(status?: string) {
  if (status === "draft-saved") return "Draft saved successfully.";
  if (status === "deleted") return "Note deleted successfully.";
  return null;
}

function formatDisplayDate(value: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { status } = await searchParams;
  const supabase = await supabaseServer();

  const { data: notes } = await supabase
    .from("posts")
    .select("id, title, slug, published, created_at")
    .order("created_at", { ascending: false });

  const typedNotes = (notes ?? []) as PostSummary[];
  const statusMessage = getStatusMessage(status);

  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in notes-shell">
          <p className="section-kicker">Admin workspace</p>

          <h1
            className="heading-cursive"
            style={{ fontSize: 38, fontWeight: 900, marginBottom: 10 }}
          >
            Admin
          </h1>

          <p className="text-muted" style={{ marginBottom: 18 }}>
            Create, publish, and manage the teaching notes that appear in the
            public archive.
          </p>

          {statusMessage ? (
            <div className="status-banner soft-fade-in">{statusMessage}</div>
          ) : null}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <Link className="nav-link" href="/admin/new">
              New note
            </Link>
            <Link className="nav-link" href="/notes">
              View notes
            </Link>
          </div>

          <div className="crisp-card" style={{ padding: 20 }}>
            <h2 className="heading-cursive" style={{ fontSize: 24, marginBottom: 8 }}>
              Recent Notes
            </h2>
            <p className="text-muted" style={{ marginBottom: 16 }}>
              Drafts are visible only to admins.
            </p>

            {typedNotes.length ? (
              <div className="admin-note-list">
                {typedNotes.map((note) => (
                  <div key={note.id} className="admin-note-row">
                    <div className="admin-note-copy">
                      <Link className="admin-note-title" href={`/notes/${note.slug}`}>
                        {note.title}
                      </Link>

                      <p className="text-muted">
                        {formatDisplayDate(note.created_at)
                          ? `Created ${formatDisplayDate(note.created_at)}`
                          : "Creation date unavailable"}
                      </p>
                    </div>

                    <div className="admin-note-actions">
                      <span
                        className={`note-pill ${
                          note.published ? "note-pill-soft" : "note-pill-draft"
                        }`.trim()}
                      >
                        {note.published ? "Published" : "Draft"}
                      </span>

                      <Link className="nav-link" href={`/notes/${note.slug}`}>
                        View
                      </Link>

                      <Link className="nav-link" href={`/admin/edit/${note.slug}`}>
                        Edit
                      </Link>

                      <DeleteNoteForm slug={note.slug} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No notes yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
