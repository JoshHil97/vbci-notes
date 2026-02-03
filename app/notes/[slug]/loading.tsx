import BibleIcon from "@/app/components/BibleIcon";

export default function NoteLoading() {
  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card" style={{ padding: 24, marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <BibleIcon />
            <div className="bible-placeholder" style={{ height: 30, width: "60%" }} />
          </div>

          <div className="bible-placeholder" style={{ height: 14, width: 220, marginBottom: 10 }} />
          <div className="bible-placeholder" style={{ height: 14, width: 160, marginBottom: 22 }} />

          <div style={{ display: "grid", gap: 12 }}>
            <div className="bible-placeholder" style={{ height: 14, width: "95%" }} />
            <div className="bible-placeholder" style={{ height: 14, width: "92%" }} />
            <div className="bible-placeholder" style={{ height: 14, width: "88%" }} />
            <div className="bible-placeholder" style={{ height: 14, width: "90%" }} />
            <div className="bible-placeholder" style={{ height: 14, width: "80%" }} />
          </div>
        </section>
      </main>
    </div>
  );
}
