import AdminClient from "./AdminClient";

export default function AdminPage() {
  return (
    <section className="mt-20 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">
        Draft Editor
      </h1>
      <AdminClient />
    </section>
  );
}
