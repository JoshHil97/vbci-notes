import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

type PostSummary = {
  id: string;
  title: string;
  slug: string;
  published: boolean | null;
  created_at: string | null;
};

export default async function AdminPage() {
  const supabase = await supabaseServer();

  const { data: notes } = await supabase
    .from("posts")
    .select("id, title, slug, published, created_at")
    .order("created_at", { ascending: false });

  const typedNotes = (notes ?? []) as PostSummary[];

  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in" style={{ padding: 24, marginTop: 18 }}>
          <h1 className="heading-cursive" style={{ fontSize: 38, fontWeight: 900, marginBottom: 10 }}>
            Admin
          </h1>

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
              <div style={{ display: "grid", gap: 12 }}>
                {typedNotes.map((note) => (
                  <div key={note.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Link className="nav-link" href={`/notes/${note.slug}`}>
                      {note.title}
                    </Link>

                    {!note.published ? (
                      <span className="text-muted" style={{ fontSize: 12 }}>
                        Draft
                      </span>
                    ) : null}

                    <Link className="nav-link" href={`/admin/edit/${note.slug}`}>
                      Edit
                    </Link>

                    <form action={`/admin/delete/${note.slug}`} method="post">
                      <button
                        type="submit"
                        className="nav-link"
                        style={{ background: "transparent", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </form>
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
