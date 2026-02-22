// Footer of website
"use client";

export default function Footer() {
  return (
    <footer className="bg-dark-navy text-light-beige py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left side */}
          <div className="text-center md:text-left">
            <p className="font-heading font-bold text-lg">JumboFind</p>
            <p className="text-sm opacity-80">Tufts Lost and Found</p>
          </div>

          {/* Center - Quick Links */}
          <div className="flex gap-6 text-sm">
            <a href="/" className="hover:opacity-80">Hub</a>
            <a href="/overview" className="hover:opacity-80">Map</a>
            <a href="/aboutus" className="hover:opacity-80">About Us</a>
          </div>

          {/* Right side */}
          <div className="text-center md:text-right text-sm">
            <p>Contact: hello@jumbofind.com</p>
            <p className="opacity-80">© 2026 JumboFind</p>
          </div>
        </div>
      </div>
    </footer>
  );
}