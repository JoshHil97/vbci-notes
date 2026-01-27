import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingTop: 28 }}>
      <h1 className="text-2xl font-semibold mb-2">Note not found</h1>
      <p className="opacity-80 mb-4">
        This sermon note might have been removed or the link is incorrect.
      </p>
      <Link className="underline" href="/notes">
        Back to Weekly Notes
      </Link>
    </div>
  );
}
