import AdminClient from "../AdminClient";

export default function NewNotePage() {
  return (
    <div className="paper-page">
      <main className="container-narrow" style={{ padding: "30px 0 60px" }}>
        <section className="crisp-card soft-fade-in" style={{ padding: 24, marginTop: 18 }}>
          <AdminClient />
        </section>
      </main>
    </div>
  );
}
