import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { notifySubscribersOfPublishedPost } from "@/lib/post-email";

const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  speaker: z.string().trim().nullable().optional(),
  preached_at: z.string().trim().nullable().optional(),
  summary: z.string().trim().nullable().optional(),
  youtube_url: z.string().trim().nullable().optional(),
  content_json: z.any(),
  published: z.boolean(),
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

  const parsed = postSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid post payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const previousPost = input.id
    ? await supabase
        .from("posts")
        .select("id, slug, published")
        .eq("id", input.id)
        .single()
    : null;

  if (previousPost?.error) {
    return NextResponse.json(
      { error: previousPost.error.message },
      { status: 500 }
    );
  }

  const savePayload = {
    title: input.title,
    slug: input.slug,
    speaker: input.speaker || null,
    preached_at: input.preached_at || null,
    summary: input.summary || null,
    youtube_url: input.youtube_url || null,
    content_json: input.content_json,
    published: input.published,
  };

  const writeResult = input.id
    ? await supabase
        .from("posts")
        .update(savePayload)
        .eq("id", input.id)
        .select("slug")
        .single()
    : await supabase.from("posts").insert(savePayload).select("slug").single();

  if (writeResult.error) {
    return NextResponse.json(
      { error: writeResult.error.message },
      { status: 500 }
    );
  }

  const shouldNotify = input.published && !previousPost?.data?.published;
  const origin = new URL(request.url).origin;

  const emailResult = shouldNotify
    ? await notifySubscribersOfPublishedPost(
        {
          slug: writeResult.data.slug,
          title: input.title,
          summary: input.summary,
          speaker: input.speaker,
          preached_at: input.preached_at,
        },
        origin
      )
    : {
        deliveries: 0,
        message: input.published
          ? "Post saved. Subscriber email was not re-sent because this note was already published."
          : "Draft saved.",
        status: "skipped" as const,
      };

  return NextResponse.json({
    ok: true,
    slug: writeResult.data.slug,
    email: emailResult,
  });
}
