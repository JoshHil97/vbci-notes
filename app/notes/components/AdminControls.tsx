import Link from "next/link";

export default function AdminControls({ slug }: { slug?: string }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <Link className="nav-link" href="/admin">
        Admin
      </Link>

      <Link className="nav-link" href="/admin/new">
        New note
      </Link>

      {slug ? (
        <>
          <Link className="nav-link" href={`/admin/edit/${slug}`}>
            Edit
          </Link>

          <form action={`/admin/delete/${slug}`} method="post" style={{ display: "inline" }}>
            <button
              type="submit"
              className="nav-link"
              style={{ background: "transparent", cursor: "pointer" }}
            >
              Delete
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
