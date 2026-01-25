import Container from "@/app/components/Container";
import Card from "@/app/components/ui/Card";

export default function AboutPage() {
  return (
    <main className="vbci-page">
      <Container>
        <section className="vbci-hero">
          <h1 className="vbci-h1">About VBCI Notes</h1>
          <p className="vbci-subtitle">
            VBCI Notes exists to preserve weekly teachings so they can be revisited, reflected on, and shared within the
            church family.
          </p>
        </section>

        <section className="vbci-section">
          <div className="vbci-stack">
            <Card>
              <h2 className="vbci-h2">Clarity</h2>
              <p className="vbci-muted">
                Notes are structured so the message stays simple, readable, and true to what was taught.
              </p>
            </Card>

            <Card>
              <h2 className="vbci-h2">Consistency</h2>
              <p className="vbci-muted">
                A predictable weekly rhythm so the church knows where to find the write up every time.
              </p>
            </Card>

            <Card>
              <h2 className="vbci-h2">Growth</h2>
              <p className="vbci-muted">
                A space to revisit the Word throughout the week and build understanding over time.
              </p>
            </Card>
          </div>
        </section>
      </Container>
    </main>
  );
}
