import { Plus } from "lucide-react";
import { useStickerStore } from "../store/useCounterStore";
import { CATEGORY_META, type Sticker } from "../data/mockStickers";

interface Props {
  sticker: Sticker;
  editing: boolean;
}

export default function StickerCard({ sticker, editing }: Props) {
  const { toggleOwned, incrementQuantity } = useStickerStore();
  const meta = CATEGORY_META[sticker.category];

  return (
    <button
      onClick={() => editing && toggleOwned(sticker.id)}
      className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 p-2 transition-transform border-none select-none ${editing ? "active:scale-95 cursor-pointer" : "cursor-default"} ${
        sticker.owned
          ? "bg-green-500 shadow-sm"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Duplicate badge — still useful to see in the grid */}
      {sticker.quantity > 1 && (
        <div className="absolute top-1.5 right-1.5 bg-white rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm">
          <span className="text-[10px] font-bold text-green-600">
            ×{sticker.quantity}
          </span>
        </div>
      )}

      <span className="text-2xl leading-none">{meta.emoji}</span>
      <span
        className={`text-[10px] font-bold tracking-wide ${
          sticker.owned ? "text-white" : "text-gray-400"
        }`}
      >
        {sticker.number}
      </span>

      {/* Plus button to add a duplicate — only visible when owned and editing */}
      {editing && sticker.owned && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            incrementQuantity(sticker.id);
          }}
          className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center cursor-pointer border-none"
        >
          <Plus size={11} className="text-white" strokeWidth={3} />
        </button>
      )}
    </button>
  );
}
