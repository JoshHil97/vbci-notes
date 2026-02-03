import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function Navbar() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="navbar">
      <div className="container-narrow">
        <div className="nav-inner">
          <div className="brand">
            <Link href="/" className="heading-cursive" style={{ fontSize: 18, fontWeight: 700 }}>
              Oil for the Journey
            </Link>
            <small>Scripture, reflection, and teaching for the journey of faith</small>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/notes">Notes</Link>
            <Link className="nav-link" href="/about">About</Link>
            <Link className="nav-link" href="/admin">Admin</Link>

            {user ? (
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className="nav-link"
                  style={{ background: "transparent", cursor: "pointer" }}
                >
                  Logout
                </button>
              </form>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
