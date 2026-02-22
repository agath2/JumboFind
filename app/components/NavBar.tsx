"use client";

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-dark-navy text-light-beige shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-22">
          {/* Logo/Brand */}
          <Link href="/" className="text-3xl font-heading font-bold hover:opacity-80 transition">
            JumboFind
          </Link>

          {/* Nav Links */}
          <div className="flex gap-9 font-body text-lg">
            <Link href="/" className="hover:opacity-80 transition">
              Hub
            </Link>
            <Link href="/overview" className="hover:opacity-80 transition">
              Map
            </Link>
            <Link href="/lostfeed" className="hover:opacity-80 transition">
              Search Item
            </Link>
            <Link href="/reportitem" className="hover:opacity-80 transition">
              Found Item
            </Link>
            <Link href="/aboutus" className="hover:opacity-80 transition">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}