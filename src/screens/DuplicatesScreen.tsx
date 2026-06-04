import { useState, useMemo } from "react";
import { Layers } from "lucide-react";
import { useStickerStore } from "../store/useCounterStore";
import { CATEGORY_META } from "../data/mockStickers";
import SearchBar from "../components/SearchBar";

export default function DuplicatesScreen() {
  const { stickers, decrementQuantity, incrementQuantity } = useStickerStore();
  const [search, setSearch] = useState("");
  const duplicates = stickers.filter((s) => s.quantity > 1);
  const totalExtras = duplicates.reduce((acc, s) => acc + s.quantity - 1, 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return duplicates;
    return duplicates.filter(
      (s) =>
        s.number.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [duplicates, search]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 shadow-sm">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
          Duplicates
        </h1>
        <p className="text-[14px] text-gray-400 mt-0.5 font-medium">
          {duplicates.length > 0
            ? `${totalExtras} sticker${totalExtras !== 1 ? "s" : ""} available to trade`
            : "No duplicates yet"}
        </p>
        <div className="mt-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search sticker (e.g. BRA5)"
          />
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-28 overflow-y-auto">
        {duplicates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Layers size={28} color="#C7C7CC" strokeWidth={1.5} />
            </div>
            <p className="text-[15px] font-medium text-gray-400">
              No duplicate stickers
            </p>
            <p className="text-[13px] text-gray-300 text-center px-8">
              When you have more than one copy of a sticker it will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <p className="text-[15px] font-medium">No results for "{search}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((sticker) => {
              const meta = CATEGORY_META[sticker.category];
              const extras = sticker.quantity - 1;
              return (
                <div
                  key={sticker.id}
                  className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3.5 shadow-sm"
                >
                  {/* Category icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-2xl">{meta.emoji}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate leading-tight">
                      {sticker.name}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {sticker.number} · {sticker.category}
                    </p>
                  </div>

                  {/* Extras badge + controls */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <p
                        className="text-[15px] font-bold"
                        style={{ color: "#007AFF" }}
                      >
                        +{extras}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        extra
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => decrementQuantity(sticker.id)}
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 cursor-pointer border-none text-gray-600 font-bold text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="text-[13px] font-bold text-gray-800 w-4 text-center tabular-nums">
                        {sticker.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(sticker.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center active:opacity-80 cursor-pointer border-none text-white font-bold text-lg leading-none"
                        style={{ background: "#007AFF" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
