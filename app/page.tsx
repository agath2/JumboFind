"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="flex h-full items-center justify-center bg-[#f4f6f8] px-4 py-30">
      <div className="w-full max-w-4xl">
        <h1 className="mt-8 mb-16 text-center text-5xl font-heading font-bold text-dark-navy">
          Tufts Lost and Found
        </h1>
        
        <div className="flex flex-col gap-8">
          {/* Lost Item Card */}
          <Link
            href="/lostfeed"
            className={`group relative h-64 overflow-hidden rounded-2xl shadow-lg transition-all duration-700 ease-out hover:shadow-2xl ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
                alt="Lost items"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/80 to-dark-navy/60 transition-opacity duration-300 group-hover:opacity-90" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-between px-12">
              <div className="text-left">
                <h2 className="text-6xl font-heading font-bold text-white transition-all duration-300 group-hover:translate-x-4">
                  Lost
                </h2>
                <p className="mt-2 text-lg text-light-beige opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-4">
                  Search for your lost items
                </p>
              </div>
              
              <div className="text-4xl text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2">
                →
              </div>
            </div>
          </Link>

          {/* Found Item Card */}
          <Link
            href="/reportitem"
            className={`group relative h-64 overflow-hidden rounded-2xl shadow-lg transition-all duration-700 delay-150 ease-out hover:shadow-2xl ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=800&q=80"
                alt="Found items"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-dark-yellow/80 to-dark-yellow/60 transition-opacity duration-300 group-hover:opacity-90" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-between px-12">
              <div className="text-left">
                <h2 className="text-6xl font-heading font-bold text-dark-brown transition-all duration-300 group-hover:translate-x-4">
                  Found
                </h2>
                <p className="mt-2 text-lg text-dark-brown opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-4">
                  Report items you've found
                </p>
              </div>
              
              <div className="text-4xl text-dark-brown opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2">
                →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
