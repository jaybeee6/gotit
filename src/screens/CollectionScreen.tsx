import { useState, useMemo } from "react";
import { useStickerStore } from "../store/useCounterStore";
import StickerCard from "../components/StickerCard";
import SearchBar from "../components/SearchBar";

type Filter = "all" | "have" | "missing";

export default function CollectionScreen() {
  const { stickers } = useStickerStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);

  const owned = stickers.filter((s) => s.owned).length;
  const total = stickers.length;
  const progress = total > 0 ? owned / total : 0;

  const circumference = 2 * Math.PI * 26;
  const dash = circumference * progress;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stickers.filter((s) => {
      const matchFilter =
        filter === "all" || (filter === "have" ? s.owned : !s.owned);
      const matchSearch =
        !q ||
        s.number.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [stickers, filter, search]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
            My Collection
          </h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-[17px] font-medium cursor-pointer border-none bg-transparent"
              style={{ color: "#007AFF" }}
            >
              Edit
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 mt-4">
          {/* Progress ring */}
          <div className="relative w-17 h-17 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="5"
              />
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="#007AFF"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[13px] font-bold text-gray-900">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* Counters */}
          <div className="flex gap-5">
            <div className="flex flex-col">
              <span className="text-[22px] font-bold text-gray-900 leading-tight">
                {owned}
              </span>
              <span className="text-xs text-gray-400 font-medium">Have</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[22px] font-bold text-gray-900 leading-tight">
                {total - owned}
              </span>
              <span className="text-xs text-gray-400 font-medium">Missing</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[22px] font-bold text-gray-900 leading-tight">
                {total}
              </span>
              <span className="text-xs text-gray-400 font-medium">Total</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search sticker (e.g. BRA5)"
          />
        </div>

        {/* Segmented filter */}
        <div className="mt-3 bg-gray-100 rounded-xl p-1 flex gap-1">
          {(["all", "have", "missing"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[10px] transition-all cursor-pointer border-none ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 bg-transparent"
              }`}
            >
              {f === "all" ? "All" : f === "have" ? "Have" : "Missing"}
            </button>
          ))}
        </div>
      </div>

      {/* Sticker grid */}
      <div className="flex-1 px-4 pt-4 pb-28 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p className="text-base font-medium">No stickers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((sticker) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                editing={editing}
              />
            ))}
          </div>
        )}
      </div>

      {/* Save Changes bar — fixed above the bottom nav */}
      {editing && (
        <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setEditing(false)}
              className="w-full py-4 rounded-2xl text-white text-[17px] font-semibold cursor-pointer border-none shadow-lg"
              style={{ background: "#34C759" }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
