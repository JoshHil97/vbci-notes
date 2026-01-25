import Link from "next/link";

export default function Navbar() {
  return (
    <header className="vbci-nav">
      <div className="vbci-nav-inner">
        <div className="vbci-brand">VBCI Notes</div>
        <nav className="vbci-nav-links">
          <Link className="vbci-pill" href="/">Home</Link>
          <Link className="vbci-pill" href="/notes">Weekly Notes</Link>
          <Link className="vbci-pill" href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
