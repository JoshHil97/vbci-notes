import { Suspense } from "react";
import ScriptureCollage from "@/app/components/ScriptureCollage";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="paper-page">
      <ScriptureCollage />
      <Suspense fallback={null}>
        <LoginClient />
      </Suspense>
    </div>
  );
}
