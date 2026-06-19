"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Experience", href: "#format-experience" },
  { label: "Formats",    href: "#format-guide" },
  { label: "Compare",   href: "#compare" },
];

interface NavbarProps {
  onCompareClick?: () => void;
}

export default function Navbar({ onCompareClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "#compare" && onCompareClick) {
      onCompareClick();
    }
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, href === "#compare" ? 80 : 0);
  };

  return (
    <header
      className="navbar-bar"
      style={{
        background: scrolled
          ? "linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(16px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(160%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,169,110,0.07)" : "none",
        transition: "background 0.55s ease, backdrop-filter 0.55s ease, border-color 0.55s ease",
      }}
    >
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#hero" onClick={(e) => go(e, "#hero")} className="navbar-logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/varanasi-logo-transparent.png"
            alt="Varanasi"
            className="navbar-logo-img"
            draggable={false}
          />
        </a>

        {/* Links */}
        <nav className="navbar-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => go(e, link.href)} className="navbar-link">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
