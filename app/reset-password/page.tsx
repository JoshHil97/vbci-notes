"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/app/lib/supabase-client";

export default function ResetPasswordPage() {
  const supabase = supabaseBrowser();
  const [password, setPassword] = useState("");

  async function handleReset() {
    await supabase.auth.updateUser({ password });
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Reset Password</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
      />
      <button onClick={handleReset}>Reset</button>
    </main>
  );
}
