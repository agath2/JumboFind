import Link from "next/link";

export default function FilterPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-xl bg-white p-8 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
        <h1 className="mb-6 text-3xl font-bold text-[#3E5E8C]">Filter Lost Items</h1>

        <form action="/lost" method="GET" className="space-y-4">
          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium text-[#222]">
              Where did you lose it?
            </label>
            <select
              id="location"
              name="location"
              defaultValue="all"
              className="w-full rounded-lg border border-[#ccc] px-3 py-3 text-base"
            >
              <option value="all">I forgot</option>
              <option value="tisch">Tisch Library</option>
              <option value="dewick">Dewick Dining</option>
              <option value="halligan">Halligan Hall</option>
              <option value="campus">Campus Center</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-[#222]">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue="all"
              className="w-full rounded-lg border border-[#ccc] px-3 py-3 text-base"
            >
              <option value="all">I forgot</option>
              <option value="id">ID Card</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#3E5E8C] px-4 py-3 text-base font-medium text-white transition hover:bg-[#2f486b]"
          >
            Search
          </button>
        </form>

        <Link href="/" className="mt-5 inline-block text-sm font-medium text-[#3E5E8C] hover:underline">
          ← Home
        </Link>
      </div>
    </main>
  );
}
