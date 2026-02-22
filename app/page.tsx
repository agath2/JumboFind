import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-10 text-4xl font-bold text-[#3E5E8C]">
          Tufts Lost and Found
        </h1>
        <div className="space-y-4">
            <Link
              href="/lostfeed"
              className="block w-full rounded-lg bg-dark-yellow px-6 py-4 text-lg font-medium text-dark-brown transition hover:bg-[#d18e3a]"
            >
              Lost
            </Link> 
            <Link
              href="/reportitem"
              className="block w-full rounded-lg bg-dark-yellow px-6 py-4 text-lg font-medium text-dark-brown transition hover:bg-[#d18e3a]"
            >
              Found
            </Link>
          </div>
      </div>
    </main>
  );
}
