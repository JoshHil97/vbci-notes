import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  source: z.string().trim().max(80).optional().default("site"),
  website: z.string().trim().max(200).optional().default(""),
});

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = subscribeSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const { email, source, website } = parsed.data;

  // Hidden field to discourage bot signups without surfacing a different response.
  if (website) {
    return NextResponse.json({
      ok: true,
      message: "You are on the list.",
    });
  }

  try {
    const supabaseAdmin = getAdminClient();
    const now = new Date().toISOString();

    const { error } = await supabaseAdmin.from("email_subscribers").upsert(
      {
        email,
        source,
        subscribed_at: now,
        unsubscribed_at: null,
        updated_at: now,
      },
      { onConflict: "email" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "You are on the list for weekly note emails.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save subscription.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
