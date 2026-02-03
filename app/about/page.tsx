export default function AboutPage() {
  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in" style={{ padding: 24, marginTop: 18 }}>
          <h1 className="heading-cursive" style={{ fontSize: 38, fontWeight: 900, marginBottom: 10 }}>
            About Oil for the Journey
          </h1>

          <p className="text-muted" style={{ marginBottom: 18, maxWidth: 860 }}>
            Oil for the Journey is a place for scripture, reflection, and teaching, built around the fullness of salvation and the ongoing journey of faith.
          </p>

          <div style={{ display: "grid", gap: 14 }}>
            <div className="crisp-card" style={{ padding: 18 }}>
              <h2 className="heading-cursive" style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
                The theme
              </h2>
              <p style={{ marginBottom: 8 }}>
                <strong>1 Samuel 16:1</strong>
              </p>
              <p className="text-muted">
                God told Samuel to fill his horn with oil. Oil marks readiness. It is preparation for the next assignment. It is a sign that God is moving you forward, and you cannot stay empty.
              </p>
            </div>

            <div className="crisp-card" style={{ padding: 18 }}>
              <h2 className="heading-cursive" style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
                Scripture as oil and weapon
              </h2>
              <p className="text-muted" style={{ marginBottom: 8 }}>
                The Word fills you. It strengthens your inner life. It sharpens your discernment. It keeps your spirit warm when the journey feels long.
              </p>
              <p className="text-muted">
                And the Word is also a weapon. When the enemy comes with accusation, confusion, fear, and compromise, scripture answers back with truth, identity, and promise.
              </p>
            </div>

            <div className="crisp-card" style={{ padding: 18 }}>
              <h2 className="heading-cursive" style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
                What you will find here
              </h2>
              <ul style={{ marginLeft: 18, display: "grid", gap: 8 }}>
                <li>Teaching notes that are clear, structured, and easy to revisit</li>
                <li>Scripture collections focused on salvation, identity, and daily faith</li>
                <li>Reflection prompts that help the Word move from page to practice</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
