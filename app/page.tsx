import Container from "./components/Container";
import Card from "./components/ui/Card";
import GlowButton from "./components/GlowButton";

export default function HomePage() {
  return (
    <main className="vbci-page">
      <Container>
        <section className="vbci-hero">
          <div className="vbci-kicker">
            <div className="vbci-label">Scripture focus</div>
            <div className="vbci-muted">Habakkuk 2:2</div>
            <div className="vbci-quote">
              “Write the vision and make it plain, that he may run who reads it.”
            </div>
          </div>

          <h1 className="vbci-h1">Weekly Notes, made easy to revisit</h1>

          <p className="vbci-subtitle">
            A dedicated space for weekly sermon notes, written clearly and preserved so the church
            family can revisit, reflect, and grow in the Word. Each entry will include the full
            notes and a short summary.
          </p>

          <div className="vbci-actions">
            <GlowButton href="/notes">Read weekly notes</GlowButton>
            <GlowButton href="/about" variant="secondary">
              About this page
            </GlowButton>
          </div>
        </section>

        <section className="vbci-section">
          <Card>
            <h2 className="vbci-h2">What you will get</h2>
            <p className="vbci-muted" style={{ marginTop: 10 }}>
              Clear write ups, faithful summaries, and a growing archive of teachings for reflection
              and study.
            </p>
          </Card>
        </section>
      </Container>
    </main>
  );
}
