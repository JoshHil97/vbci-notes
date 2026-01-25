import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  const {
    title,
    slug,
    speaker,
    preached_on,
    video_url,
    content_html,
    summary,
  } = body;

  if (!title || !slug || !content_html) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("notes")
    .upsert(
      {
        title,
        slug,
        speaker: speaker || null,
        preached_on: preached_on || null,
        video_url: video_url || null,
        content_html,
        summary: summary || null,
      },
      { onConflict: "slug" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
