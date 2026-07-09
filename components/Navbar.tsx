"use client";

import Link from "next/link";
import { useState } from "react";

// ------------------------------------------------------------
// Navbar Component
// Blue gradient header with navigation links.
// Includes a simple mobile menu toggle for responsiveness.
// ------------------------------------------------------------

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="gradient-header text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo / Project Name */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            🚗 SpeedGuard AI
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
          <Link
            href="/result"
            className="hover:text-blue-200 transition-colors"
          >
            Result
          </Link>
          <Link
            href="/about"
            className="hover:text-blue-200 transition-colors"
          >
            About
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-4 px-6 pb-4 text-sm font-medium fade-in">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/result" onClick={() => setMenuOpen(false)}>
            Result
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </div>
      )}
    </header>
  );
}
