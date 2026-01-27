import Link from "next/link";
import ScriptureCollage from "@/app/components/ScriptureCollage";
import AdminControls from "@/app/components/AdminControls";
import { supabaseServer } from "@/lib/supabase-server";

export default async function NotesPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notes } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="paper-page">
      <ScriptureCollage />

      <main
        className="container-narrow"
        style={{ position: "relative", zIndex: 2, padding: "30px 60px" }}
      >
        <h1 className="heading-cursive" style={{ fontSize: 42 }}>
          Weekly Notes
        </h1>

        <p className="text-muted">
          Scripture based teaching for the journey of faith
        </p>

        {user ? <AdminControls /> : null}

        {notes?.map((note: any) => (
          <div key={note.id} style={{ marginTop: 24 }}>
            <Link href={`/notes/${note.slug}`} className="nav-link">
              {note.title}
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
