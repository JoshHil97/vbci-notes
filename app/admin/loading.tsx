import BibleIcon from "@/app/components/BibleIcon";

export default function AdminLoading() {
  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card" style={{ padding: 24, marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <BibleIcon />
            <div className="bible-placeholder" style={{ height: 28, width: 180 }} />
          </div>

          <div className="bible-placeholder" style={{ height: 14, width: 320, marginBottom: 18 }} />

          <div style={{ display: "grid", gap: 12 }}>
            <div className="bible-placeholder" style={{ height: 18, width: "86%" }} />
            <div className="bible-placeholder" style={{ height: 18, width: "92%" }} />
            <div className="bible-placeholder" style={{ height: 18, width: "78%" }} />
            <div className="bible-placeholder" style={{ height: 18, width: "88%" }} />
          </div>
        </section>
      </main>
    </div>
  );
}

