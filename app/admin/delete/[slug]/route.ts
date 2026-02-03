import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const supabase = await supabaseServer();

  const { error } = await supabase.from("posts").delete().eq("slug", slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = new URL("/admin", request.url);
  return NextResponse.redirect(url);
}
