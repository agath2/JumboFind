"use client";

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-dark-navy text-light-beige shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <Link href="/" className="text-2xl font-heading font-bold hover:opacity-80 transition">
            JumboFind
          </Link>

          {/* Nav Links */}
          <div className="flex gap-6 font-body">
            <Link href="/" className="hover:opacity-80 transition">
              Map
            </Link>
            <Link href="/overview" className="hover:opacity-80 transition">
              Overview
            </Link>
            <Link href="/report" className="hover:opacity-80 transition">
              Report Item
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}