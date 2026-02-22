"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {LostItem} from "../items";
import getItems from "@/app/actions/getitems";

export default function LostFeedPage() {
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Controls the Fold/Unfold
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  
  // Filter State
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [items, setItems] = useState<LostItem[]>([]);

  // Do basic search on page load
  useEffect(() => {
      getItems().then(items => {
        items = items.filter((item) => {
            // 1. Keyword Match (Searches Title OR Description safely)
            const lowerQuery = searchQuery.toLowerCase();
            const matchesTitle = item.title.toLowerCase().includes(lowerQuery);

            // We use the '?' operator to ensure the app doesn't crash if the backend sends an item with no description
            const matchesDesc = item.description
                ? item.description.toLowerCase().includes(lowerQuery)
                : false;

            const matchesSearch = matchesTitle || matchesDesc;
            // 2. Location Match
            const matchesLocation = locationFilter === "all" || item.location === locationFilter;
            // 3. Category Match
            const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

            return matchesSearch && matchesLocation && matchesCategory;
        })
            .sort((a, b) => {
                // 4. Sort by Status (Active first, Claimed second)
                if (a.isFound !== b.isFound) return a.isFound ? 1 : -1;
                // 5. Sort by Date (Newest first, relies on YYYY-MM-DD)
                return b.date.localeCompare(a.date);
            });

        setItems(items);
    });
  }, []);

  // Date Formatter
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#222]">
      
      {/* Header */}
      <header className="bg-white border-b border-[#e6e6e6] px-4 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#3E5E8C]">Tufts JumboFind Feed</h1>
          <Link href="/" className="text-sm font-semibold text-[#3E5E8C] border border-[#d8e0ee] px-3 py-2 rounded-lg hover:bg-[#eef5ff]">
            ← Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Search & Filter Controls */}
        <div className="mb-8">
          <div className="flex w-full gap-2 mb-2">
            <input
              type="text"
              placeholder="Search lost items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow rounded-lg border border-[#e8e8e8] p-4 focus:border-[#3E5E8C] focus:outline-none focus:ring-1 focus:ring-[#3E5E8C]"
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-lg px-6 text-xl font-bold transition ${
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
                  <option value="tisch">Tisch Library</option>
                  <option value="dewick">Dewick Dining</option>
                  <option value="halligan">Halligan Hall</option>
                  <option value="campus">Campus Center</option>
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
                  <option value="id">ID Card</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
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
                  item.isFound
                    ? "border-red-500 opacity-60"
                    : "border-green-500 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <img src={item.imageUrl} alt={item.title} className="h-[160px] w-full object-cover bg-gray-100" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold truncate pr-2">{item.title}</h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      item.isFound ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                      {item.isFound ? "Claimed" : "Active"}
                    </span>
                  </div>
                  <p className="text-sm text-[#444] mb-1"><span className="font-bold capitalize">Where:</span> {item.location}</p>
                  <p className="text-sm text-[#444]"><span className="font-bold">Date:</span> {formatDate(item.date)}</p>
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
              <h2 className="pr-3 text-xl font-bold text-[#1f3552]">{selectedItem.title}</h2>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-[#3E5E8C] hover:bg-[#eef5ff]"
              >
                ✕
              </button>
            </div>

            <img src={selectedItem.imageUrl} alt={selectedItem.title} className="mb-4 h-44 w-full rounded-lg object-cover bg-gray-100" />

            <div className="space-y-2 text-sm text-[#334]">
              <p><span className="font-bold">Where:</span> {selectedItem.location}</p>
              <p><span className="font-bold">When:</span> {formatDate(selectedItem.date)}</p>
              <p>
                <span className="font-bold">Contact:</span>{" "}
                {selectedItem.contactInfo || "Not provided by finder."}
              </p>
            </div>

            <button
              type="button"
              disabled={selectedItem.isFound}
              onClick={() => alert("Marked! We will connect you with the finder soon.")}
              className={`mt-5 w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition ${
                selectedItem.isFound
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-[#3E5E8C] hover:bg-[#2f486b]"
              }`}
            >
              {selectedItem.isFound ? "Already Claimed" : "I found it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
