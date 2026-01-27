"use client";

import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/notes";

  return (
    <main className="paper-page">
      <div className="container-narrow" style={{ position: "relative", zIndex: 2, padding: "30px 60px" }}>
        <h1 className="heading-curse" style={{ fontSize: 42 }}>
          Login
        </h1>

        <p className="text-muted">
          After login you will be sent to {next}
        </p>

        <p className="text-muted">
          Replace this placeholder with your real login UI.
        </p>
      </div>
    </main>
  );
}
