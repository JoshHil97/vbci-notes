"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/notes";
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // Hard navigation ensures the server components (like the navbar) re-render
    // with the newly-set auth cookies.
    window.location.assign(next);
  }

  return (
    <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
      <section className="crisp-card soft-fade-in" style={{ padding: 24, marginTop: 18, maxWidth: 560 }}>
        <h1 className="heading-cursive" style={{ fontSize: 42 }}>
          Login
        </h1>

        <p className="text-muted">
          After login you will be sent to {next}
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 20, maxWidth: 420 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          {error ? (
            <p className="text-muted" style={{ marginTop: 8 }}>
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
