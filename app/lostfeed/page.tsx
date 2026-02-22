"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {SearchParams} from "../models/searchParams"
import {SearchItem} from "../models/searchitem"

// Mock Data with YYYY-MM-DD format
// const MOCK_ITEMS: LostItem[] = [
//   { id: 1, title: "Tufts ID Card", description: "Blue Tufts ID card", location: "tisch", category: "id", isFound: false, date: "2026-02-20", imageUrl: "https://via.placeholder.com/400x200?text=Tufts+ID+Card" },
//   { id: 2, title: "Black Water Bottle", description: "Hydro Flask water bottle", location: "dewick", category: "other", isFound: true, date: "2026-02-19", imageUrl: "https://via.placeholder.com/400x200?text=Water+Bottle" },
//   { id: 3, title: "AirPods Case", description: "White AirPods Pro case", location: "halligan", category: "electronics", isFound: false, date: "2026-02-21", imageUrl: "https://via.placeholder.com/400x200?text=AirPods+Case" },
//   { id: 4, title: "Grey Scarf", description: "Wool winter scarf", location: "campus", category: "clothing", isFound: false, date: "2026-02-18", imageUrl: "https://via.placeholder.com/400x200?text=Grey+Scarf" },
// ];


export default function LostFeedPage() {
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Controls the Fold/Unfold
  
  // Filter State
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [data, setData] = useState<SearchItem[]>([]);

  const toURLSearchParams = (searchParams: SearchParams) => {
    const params = new URLSearchParams();

    if (searchParams.name) params.append("name", String(searchParams.name));
    if (searchParams.date) params.append("date", String(searchParams.date));
    if (searchParams.location) params.append("location", String(searchParams.location));
    if (searchParams.tags) {
        // Add each tag as a separate query parameter
        searchParams.tags.forEach(tag => params.append("tags", tag));
    }
    if (searchParams.found !== undefined) params.append("found", String(searchParams.found));

    return params;
  }

  const toSearchItems = (jsonArray: any[]): SearchItem[] => {
    const items: SearchItem[] = [];
    jsonArray.forEach(item => {
      items.push({
        id: Number(item.id ?? 0),
        title: String(item.title ?? ""),
        description: String(item.desc ?? ""), 
        location: String(item.location ?? ""),
        categories: item.tags as string[],
        isFound: Boolean(item.found ?? false),
        date: String(item.date ?? ""),
        imageUrl: String(item.picture ?? "")
      });
    });
    return items;
  }

  const getData = async (searchParams: SearchParams) => {
    const urlParams = toURLSearchParams(searchParams);
    try {
      const response = await fetch(`/search?${urlParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // re-throw so caller can handle it
    }
  };
  
    // Do basic search on page load
  useEffect(() => {
    (async () => {
      console.log("retrieving items")
      const basicSearchParams: SearchParams = {
          name: "",
          date: "",
          location: "",
          tags: [],
          found: false
      };
      const items = await getData(basicSearchParams)
      setData(items)
    })
}, [])

  

  // THE FULL DATA PIPELINE
  const filteredAndSortedItems = data
    .filter((item) => {
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
      const matchesCategory = categoryFilter === "all" || categoryFilter in item.categories;
      
      return matchesSearch && matchesLocation && matchesCategory;
    })
    .sort((a, b) => {
      // 4. Sort by Status (Active first, Claimed second)
      if (a.isFound !== b.isFound) return a.isFound ? 1 : -1;
      // 5. Sort by Date (Newest first, relies on YYYY-MM-DD)
      return b.date.localeCompare(a.date);
    });

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
        {filteredAndSortedItems.length === 0 ? (
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-8 text-center text-[#555]">
            <p className="font-bold text-lg mb-2">No items found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedItems.map((item) => (
              <article
                key={item.id}
                className={`overflow-hidden rounded-xl border-l-8 bg-white shadow-sm transition-all ${
                  item.isFound ? "border-red-500 opacity-60" : "border-green-500"
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
              </article>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}