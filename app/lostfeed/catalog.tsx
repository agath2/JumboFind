// This page shows a complete catalog of all lost items

import Link from "next/link";

type Item = {
  title: string;
  where: string;
  when: string;
  imageUrl: string;
  imageAlt: string;
  location: string;
  category: string;
};

const ITEMS: Item[] = [
  {
    title: "Tufts ID Card",
    where: "Tisch Library (1st floor)",
    when: "Feb 20, 2026 • 3:15 PM",
    imageUrl: "https://via.placeholder.com/800x500?text=Tufts+ID+Card",
    imageAlt: "Tufts ID Card",
    location: "tisch",
    category: "id",
  },
  {
    title: "Black Water Bottle",
    where: "Dewick Dining",
    when: "Feb 19, 2026 • 12:40 PM",
    imageUrl: "https://via.placeholder.com/800x500?text=Black+Water+Bottle",
    imageAlt: "Black water bottle",
    location: "dewick",
    category: "other",
  },
  {
    title: "AirPods Case",
    where: "Halligan Hall",
    when: "Feb 18, 2026 • 6:05 PM",
    imageUrl: "https://via.placeholder.com/800x500?text=AirPods+Case",
    imageAlt: "AirPods case",
    location: "halligan",
    category: "electronics",
  },
  {
    title: "Grey Scarf",
    where: "Campus Center",
    when: "Feb 17, 2026 • 9:20 AM",
    imageUrl: "https://via.placeholder.com/800x500?text=Grey+Scarf",
    imageAlt: "Grey scarf",
    location: "campus",
    category: "clothing",
  },
];

export default async function LostPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; category?: string }>;
}) {
  const params = await searchParams;
  const locationFilter = params.location ?? "all";
  const categoryFilter = params.category ?? "all";

  const filteredItems = ITEMS.filter((item) => {
    if (locationFilter !== "all" && item.location !== locationFilter) {
      return false;
    }

    if (categoryFilter !== "all" && item.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#222]">
      <header className="sticky top-0 border-b border-[#e6e6e6] bg-white px-4 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-[#3E5E8C]">Lost → Browse Found Items</h1>
          <Link
            href="/"
            className="rounded-lg border border-[#d8e0ee] bg-[#f8fbff] px-3 py-2 text-sm font-semibold text-[#3E5E8C] transition hover:bg-[#eef5ff]"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 pb-10">
        <p className="mb-5 text-sm text-[#555]">
          These are items people reported as <b>found</b>. If one is yours, contact the finder (feature coming next).
        </p>

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-6 text-sm text-[#444]">
            No items match your filters. Try changing location/category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={`${item.title}-${item.when}`}
                className="overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
              >
                <img src={item.imageUrl} alt={item.imageAlt} className="block h-[170px] w-full bg-[#eaeaea] object-cover" />
                <div className="p-3">
                  <h2 className="mb-2 text-base font-bold">{item.title}</h2>
                  <p className="text-sm leading-6 text-[#444]">
                    <span className="font-bold text-[#333]">Where:</span> {item.where}
                  </p>
                  <p className="text-sm leading-6 text-[#444]">
                    <span className="font-bold text-[#333]">When:</span> {item.when}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
