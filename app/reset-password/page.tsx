"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/app/lib/supabase-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");

  async function handleReset() {
    await supabaseBrowser.auth.updateUser({ password });
  }

  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in" style={{ padding: 24, marginTop: 18, maxWidth: 560 }}>
          <h1 className="heading-cursive" style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
            Reset password
          </h1>

          <label>New password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            type="password"
          />

          <button onClick={handleReset} style={{ marginTop: 12 }}>
            Update password
          </button>
        </section>
      </main>
    </div>
  );
}
