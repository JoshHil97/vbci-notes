import ScriptureCollage from "@/app/components/ScriptureCollage";
import BibleIcon from "@/app/components/BibleIcon";

export default function NotesLoading() {
  return (
    <div className="paper-page">
      <ScriptureCollage />

      <main className="container-narrow" style={{ position: "relative", zIndex: 2, padding: "30px 60px" }}>
        <section className="crisp-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <BibleIcon />
            <div className="bible-placeholder" style={{ height: 28, width: 240 }} />
          </div>

          <div className="bible-placeholder" style={{ height: 14, width: 420, marginBottom: 18 }} />

          <div style={{ display: "grid", gap: 14 }}>
            <div className="bible-placeholder" style={{ height: 20, width: 320 }} />
            <div className="bible-placeholder" style={{ height: 20, width: 420 }} />
            <div className="bible-placeholder" style={{ height: 20, width: 280 }} />
            <div className="bible-placeholder" style={{ height: 20, width: 360 }} />
            <div className="bible-placeholder" style={{ height: 20, width: 300 }} />
          </div>
        </section>
      </main>
    </div>
  );
}

