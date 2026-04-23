import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { notifySubscribersOfPublishedPost } from "@/lib/post-email";

const notifySchema = z.object({
  slug: z.string().trim().min(1, "Slug is required."),
});

export async function POST(request: Request) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = notifySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid notify payload." },
      { status: 400 }
    );
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("slug, title, summary, speaker, preached_at, published")
    .eq("slug", parsed.data.slug)
    .single();

  if (error || !post) {
    return NextResponse.json(
      { error: error?.message ?? "Post not found." },
      { status: 404 }
    );
  }

  if (!post.published) {
    return NextResponse.json(
      { error: "Only published notes can be emailed to subscribers." },
      { status: 400 }
    );
  }

  const emailResult = await notifySubscribersOfPublishedPost(
    post,
    new URL(request.url).origin
  );

  return NextResponse.json({
    ok: emailResult.status !== "failed",
    email: emailResult,
  });
}
