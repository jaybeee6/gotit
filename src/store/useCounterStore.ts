import { create } from "zustand";
import { mockStickers, type Sticker } from "../data/mockStickers";

interface StickerStore {
  stickers: Sticker[];
  toggleOwned: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
}

export const useStickerStore = create<StickerStore>((set) => ({
  stickers: mockStickers,
  toggleOwned: (id) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, owned: !s.owned, quantity: s.owned ? 0 : 1 } : s,
      ),
    })),
  incrementQuantity: (id) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, owned: true, quantity: s.quantity + 1 } : s,
      ),
    })),
  decrementQuantity: (id) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id && s.quantity > 0
          ? { ...s, quantity: s.quantity - 1, owned: s.quantity > 1 }
          : s,
      ),
    })),
}));
