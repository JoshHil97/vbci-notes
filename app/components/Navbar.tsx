import Link from "next/link";

export default function Navbar() {
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
          </nav>
        </div>
      </div>
    </header>
  );
}
