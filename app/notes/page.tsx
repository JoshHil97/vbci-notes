import Link from "next/link";
import Container from "../components/Container";
import Card from "../components/ui/Card";
import { supabaseServer } from "../../lib/supabase-server";

const PAGE_SIZE = 6;

function toInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

type SearchParams = {
  q?: string;
  page?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function NotesPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
  const page = toInt(sp.page, 1);

  const supabase = await supabaseServer();

  let query = supabase
    .from("posts")
    .select("id,title,slug,speaker,preached_at,summary,created_at,published", {
      count: "exact",
    })
    .order("preached_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (q.length > 0) {
    query = query.or(`title.ilike.%${q}%,speaker.ilike.%${q}%`);
  }

  query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const { data: posts, count, error } = await query;

  if (error) {
    return (
      <Container>
        <Card>
          <h1 className="text-xl font-semibold">Weekly Notes</h1>
          <pre className="mt-4 text-sm opacity-80">{error.message}</pre>
        </Card>
      </Container>
    );
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/notes?${qs}` : "/notes";
  };

  return (
    <Container>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Weekly Notes</h1>
          <p className="mt-2 opacity-80">Weekly sermon notes</p>
        </div>

        <Link href="/admin" className="underline opacity-80">
          Admin
        </Link>
      </div>

      <form action="/notes" method="get" className="mt-6 flex gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by title or speaker"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
        <button className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
          Search
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {(posts ?? []).map((p) => (
          <Card key={p.id}>
            <Link
              href={`/notes/${p.slug}`}
              className="text-lg font-semibold underline"
            >
              {p.title}
            </Link>
            <div className="mt-2 text-sm opacity-80">
              {p.speaker} · {p.preached_at}
            </div>
            {p.summary && <p className="mt-3">{p.summary}</p>}
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-between text-sm opacity-80">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-3">
          <Link href={buildHref(Math.max(1, page - 1))}>Previous</Link>
          <Link href={buildHref(Math.min(totalPages, page + 1))}>Next</Link>
        </div>
      </div>
    </Container>
  );
}
