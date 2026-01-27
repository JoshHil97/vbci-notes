import Link from "next/link";

export default function AdminControls() {
  return (
    <div style={{ marginBottom: 16 }}>
      <Link href="/admin" className="nav-link">
        Admin
      </Link>
    </div>
  );
}
