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
            href="/filter"
            className="block w-full rounded-lg bg-[#3E5E8C] px-6 py-4 text-lg font-medium text-white transition hover:bg-[#2f486b]"
          >
            Lost
          </Link>

          <Link
            href="/lost"
            className="block w-full rounded-lg bg-[#3E5E8C] px-6 py-4 text-lg font-medium text-white transition hover:bg-[#2f486b]"
          >
            Found
          </Link>
        </div>
      </div>
    </main>
  );
}
