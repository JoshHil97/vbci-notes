import type { Metadata } from "next";
import QuickNotesClient from "./QuickNotesClient";

export const metadata: Metadata = {
  title: "Quick Notes | Oil for the Journey",
  description: "Capture quick thoughts, ideas, and reminders with minimal friction.",
};

export default function QuickNotesPage() {
  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "34px 0 68px" }}>
        <QuickNotesClient />
      </main>
    </div>
  );
}
