import { useState } from 'react';
import './Navbar.css';

const LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'What it checks', href: '#features' },
  { label: 'Sample report', href: '#report' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#top" className="nav__logo">
          <span className="nav__logo-mark" aria-hidden="true" />
          ResumeScan
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a href="#cta" className="btn btn-primary nav__cta">
            Scan my resume
          </a>
        </div>

        <button
          className="nav__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="nav__mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#cta" className="btn btn-primary" onClick={() => setOpen(false)}>
            Scan my resume
          </a>
        </div>
      )}
    </header>
  );
}
