"use client";

import { useEffect, useState } from "react";
import {LostItem} from "../models/item";
import getItems from "@/app/actions/getitems";
import getImage from "@/app/actions/getImage";
import {getTags} from "@/app/actions/tags";

export default function LostFeedPage() {
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Controls the Fold/Unfold
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);

  // Filter State
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [allItems, setAllItems] = useState<LostItem[]>([]);
  const [items, setItems] = useState<LostItem[]>([]);
  const [tags, setTags] = useState<string[]>([])

    const fetchLocations = async (): Promise<string[]> => {
        try {
            const res = await fetch('/locations');
            const data = await res.json();
            // Extract only the "name" field from each object
            return data.data.map((item: any) => String(item.name));
        } catch (error) {
            console.error('Error fetching locations:', error);
            return []; // return empty array on error
        }
    };

    const [locations, setLocations] = useState<string[]>([]);

    function reloadItems() {
        const i = allItems.filter((item) => {
            // 1. Keyword Match (Searches Title OR Description safely)
            const lowerQuery = searchQuery.toLowerCase();
            const matchesTitle = item.name.toLowerCase().includes(lowerQuery);

            // We use the '?' operator to ensure the app doesn't crash if the backend sends an item with no description
            const matchesDesc = item.desc
                ? item.desc.toLowerCase().includes(lowerQuery)
                : false;

            const matchesSearch = matchesTitle || matchesDesc;
            // 2. Location Match
            const matchesLocation = locationFilter === "all" || item.location === locationFilter;
            // 3. Category Match
            const matchesCategory = categoryFilter === "all" || item.tags.includes(categoryFilter);

            return matchesSearch && matchesLocation && matchesCategory;
        })
            .sort((a, b) => {
                // 4. Sort by Status (Active first, Claimed second)
                if (a.found !== b.found) return a.found ? 1 : -1;
                // 5. Sort by Date (Newest first, relies on YYYY-MM-DD)
                return b.date.localeCompare(a.date);
            });
        setItems(i);
    }

  // Do basic search on page load
  useEffect(() => {
      fetchLocations().then(locs => setLocations(locs));
      getTags().then(tags => setTags(tags));
      getItems().then(items => {
          setAllItems(items);
    });
  }, []);

    useEffect(() => {
        reloadItems();
    }, [searchQuery, locationFilter, categoryFilter, allItems]);

    const [images, setImages] = useState(new Map<number, string>());
    useEffect(() => {
        Promise.all(items.map(async (item) => [item.id, await getImage(item.picture)] as const)).then(images => setImages(new Map(images)));
    }, [items]);

    function n(s: string | undefined) { return s === 'null' ? null : s }

  return (
    <div className="mt-22 min-h-screen bg-[#f4f6f8] text-[#222]">

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Search & Filter Controls */}
        <div className="mb-8">
          <div className="flex w-full gap-2 mb-2">
            <input
              type="text"
              placeholder="Search lost items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white shadow-sm mt-3 flex-grow rounded-lg border border-[#e8e8e8] p-4 focus:border-[#3E5E8C] focus:outline-none focus:ring-1 focus:ring-[#3E5E8C]"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-lg px-6 mt-3 text-2xl font-bold transition ${
                showFilters ? "bg-[#2f486b] text-white" : "bg-[#3E5E8C] text-white hover:bg-[#2f486b]"
              }`}
            >
              {showFilters ? "−" : "+"}
            </button>
          </div>

          {/* The Fold/Unfold Accordion */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-[#e8e8e8] shadow-sm flex flex-col sm:flex-row gap-4 animate-in slide-in-from-top-2">
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#555] mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-2 border border-[#e8e8e8] rounded bg-gray-50 focus:outline-none focus:border-[#3E5E8C]"
                >
                  <option value="all">Anywhere</option>
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc}
                        </option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#555] mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 border border-[#e8e8e8] rounded bg-gray-50 focus:outline-none focus:border-[#3E5E8C]"
                >
                  <option value="all">Any Category</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* The Grid */}
        {items.length === 0 ? (
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-8 text-center text-[#555]">
            <p className="font-bold text-lg mb-2">No items found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`cursor-pointer overflow-hidden rounded-xl border-l-8 bg-white shadow-sm transition-all ${
                  item.found
                    ? "border-red-500 opacity-60"
                    : "border-green-500 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <img src={images.get(item.id)} alt={item.name} className="h-[160px] w-full object-cover bg-gray-100" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold truncate pr-2">{item.name}</h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      item.found ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                      {item.found ? "Claimed" : "Active"}
                    </span>
                  </div>
                  <p className="text-sm text-[#444] mb-1"><span className="font-bold capitalize">Found at:</span> {item.location}</p>
                  <p className="text-sm text-[#444]"><span className="font-bold">Date:</span> {item.date}</p>
                </div>
              </button>
            ))}
          </div>
        )}

      </main>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <h2 className="pr-3 text-xl font-bold text-[#1f3552]">{selectedItem.name}</h2>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-[#3E5E8C] hover:bg-[#eef5ff]"
              >
                ✕
              </button>
            </div>

            <img src={images.get(selectedItem.id)} alt={selectedItem.name} className="mb-4 h-44 w-full rounded-lg object-cover bg-gray-100" />

            <div className="space-y-2 text-sm text-[#334]">
              <p><span className="font-bold">Where:</span> {selectedItem.location}</p>
              <p><span className="font-bold">When:</span> {selectedItem.date}</p>
              <p>
                <span className="font-bold">Contact:</span>{" "}
                {n(selectedItem.email) || n(selectedItem.phone) || "Not provided by finder"}
              </p>
            </div>

            <button
              type="button"
              disabled={selectedItem.found}
              onClick={() => alert("Marked! We will connect you with the finder soon.")}
              className={`mt-5 w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition ${
                selectedItem.found
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-[#3E5E8C] hover:bg-[#2f486b]"
              }`}
            >
              {selectedItem.found ? "Already Claimed" : "I retrieved it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
