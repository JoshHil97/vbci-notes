"use client";

import { useState } from "react";
import { supabaseClient } from "@/app/lib/supabase-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset() {
    const { error } = await supabaseClient.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <h1>Reset Password</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button onClick={handleReset}>Update password</button>
      {message && <p>{message}</p>}
    </div>
  );
}
