import { notFound } from "next/navigation";
import AdminClient from "../../AdminClient";
import { supabaseServer } from "@/lib/supabase-server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditNotePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await supabaseServer();

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, slug, speaker, preached_at, summary, youtube_url, content_json, published")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in" style={{ padding: 24, marginTop: 18 }}>
          <AdminClient initialPost={post} />
        </section>
      </main>
    </div>
  );
}
