import type { Metadata } from "next";
import { Poppins, Inter } from 'next/font/google';
import "./globals.css";
import Navbar from "./components/NavBar";

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "JumboFind",
  description: "Lost and Found at Tufts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}