"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/app/lib/supabase-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");

  async function handleReset() {
    await supabaseBrowser.auth.updateUser({ password });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Reset password</h1>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        type="password"
      />
      <button onClick={handleReset}>Update password</button>
    </main>
  );
}
