import Link from "next/link";
import ScriptureCollage from "@/app/components/ScriptureCollage";
import AdminControls from "@/app/components/AdminControls";
import { supabaseServer } from "@/lib/supabase-server";

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  published: boolean | null;
};

export default async function NotesPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const baseQuery = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: notes } = user
    ? await baseQuery
    : await baseQuery.eq("published", true);

  const typedNotes = (notes ?? []) as PostListItem[];

  return (
    <div className="paper-page">
      <ScriptureCollage />

      <main
        className="container-narrow"
        style={{ position: "relative", zIndex: 2, padding: "30px 60px" }}
      >
        <section className="crisp-card soft-fade-in" style={{ padding: 24 }}>
          <h1 className="heading-cursive" style={{ fontSize: 42 }}>
            Weekly Notes
          </h1>

          <p className="text-muted">
            Scripture based teaching for the journey of faith
          </p>

          {user ? <AdminControls /> : null}

          {typedNotes.map((note) => (
            <div key={note.id} style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center" }}>
              <Link href={`/notes/${note.slug}`} className="nav-link">
                {note.title}
              </Link>
              {!note.published ? (
                <span className="text-muted" style={{ fontSize: 12 }}>
                  Draft
                </span>
              ) : null}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
