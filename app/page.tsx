import Link from "next/link";
import ScriptureCollage from "./components/ScriptureCollage";

export default function HomePage() {
  return (
    <div className="paper-page" style={{ position: "relative" }}>
      {/* Background only */}
      <ScriptureCollage density={220} darkness={0.16} />

      {/* Page content stays the same */}
      <main className="container-narrow" style={{ padding: "30px 0 60px", position: "relative", zIndex: 2 }}>
        <section className="crisp-card" style={{ padding: 24, marginTop: 18 }}>
          <p className="text-muted" style={{ marginBottom: 10 }}>
            Scripture, reflection, and teaching centred on the fullness of salvation and the ongoing journey of faith.
          </p>

          <h1 className="heading-cursive" style={{ fontSize: 44, fontWeight: 800, marginBottom: 10 }}>
            Oil for the Journey
          </h1>

          <p style={{ marginBottom: 18, maxWidth: 820 }}>
            A place to gather the Word, keep it close, and return to it again and again. These scriptures are oil for your journey, and a weapon in your hand.
          </p>

          <div className="crisp-card" style={{ padding: 18 }}>
            <h2 className="heading-cursive" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
              Total Salvation
            </h2>
            <p className="text-muted" style={{ marginBottom: 12 }}>
              New life in Christ, secured by grace, received by faith, and lived out daily.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <strong>Romans 10:9</strong>
                <div className="text-muted">Confession and faith in the risen Christ</div>
              </div>
              <div>
                <strong>Acts 4:12</strong>
                <div className="text-muted">Salvation found in no other name</div>
              </div>
              <div>
                <strong>Ephesians 2:8 to 9</strong>
                <div className="text-muted">Grace, not works</div>
              </div>
              <div>
                <strong>Titus 3:5</strong>
                <div className="text-muted">Mercy and renewal</div>
              </div>
              <div>
                <strong>John 3:16</strong>
                <div className="text-muted">Love that gives eternal life</div>
              </div>
              <div>
                <strong>2 Corinthians 5:17</strong>
                <div className="text-muted">New creation in Christ</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
            <div className="crisp-card" style={{ padding: 18 }}>
              <h3 className="heading-cursive" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
                Weekly Notes
              </h3>
              <p className="text-muted" style={{ marginBottom: 10 }}>
                Clear, structured teaching you can revisit, study, and apply.
              </p>
              <Link className="nav-link" href="/notes">
                Go to notes
              </Link>
            </div>

            <div className="crisp-card" style={{ padding: 18 }}>
              <h3 className="heading-cursive" style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
                Theme Scripture
              </h3>
              <p className="text-muted" style={{ marginBottom: 6 }}>
                1 Samuel 16:1 speaks of the horn filled with oil. In the same way, the Word fills you with strength, clarity, and consecration for the journey ahead.
              </p>
              <p className="text-muted">
                These scriptures are not decoration. They are oil for your lamp and a weapon against the enemy.
              </p>
            </div>
          </div>

          <p className="text-muted" style={{ marginTop: 16 }}>
            Want to read the teaching notes? Start here:{" "}
            <Link className="nav-link" href="/notes">
              Weekly Notes
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
