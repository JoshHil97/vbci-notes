import Link from "next/link";
import SendUpdateEmailButton from "./SendUpdateEmailButton";

export default function AdminControls({ slug }: { slug?: string }) {
  return (
    <div className="admin-controls">
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

          <SendUpdateEmailButton slug={slug} />
        </>
      ) : null}
    </div>
  );
}
