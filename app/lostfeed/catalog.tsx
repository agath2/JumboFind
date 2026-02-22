// This page shows a complete catalog of all lost items

import Link from "next/link";
import {LostItem} from "../models/item";
import getItems from "@/app/actions/getitems";
import getImage from "@/app/actions/getImage";

export default async function LostPage(searchParams: Promise<{ location?: string; category?: string }>) {
  const params = await searchParams;
  const locationFilter = params.location ?? "all";
  const categoryFilter = params.category ?? "all";

  let items: LostItem[] = (await getItems()).filter((item) => {
    if (locationFilter !== "all" && item.location !== locationFilter) {
      return false;
    }

    if (categoryFilter !== "all" && !item.tags.includes(categoryFilter)) {
      return false;
    }

    return true;
  });

  const images = new Map(await Promise.all(items.map(async (item) => [item.id, await getImage(item.picture)] as const)));

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

        {items.length === 0 ? (
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-6 text-sm text-[#444]">
            No items match your filters. Try changing location/category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={`${item.name}-${item.date}`}
                className="overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
              >
                <img src={images.get(item.id)} alt={item.desc} className="block h-[170px] w-full bg-[#eaeaea] object-cover" />
                <div className="p-3">
                  <h2 className="mb-2 text-base font-bold">{item.name}</h2>
                  <p className="text-sm leading-6 text-[#444]">
                    <span className="font-bold text-[#333]">Where:</span> {item.location}
                  </p>
                  <p className="text-sm leading-6 text-[#444]">
                    <span className="font-bold text-[#333]">When:</span> {item.date}
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
