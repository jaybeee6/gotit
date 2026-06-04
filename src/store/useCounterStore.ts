import { create } from "zustand";
import { mockStickers, type Sticker } from "../data/mockStickers";
import { supabase } from "../lib/supabase";

interface StickerStore {
  stickers: Sticker[];
  loading: boolean;
  loadStickers: () => Promise<void>;
  toggleOwned: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
}

async function upsertSticker(sticker: Sticker) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_stickers").upsert(
    {
      user_id: user.id,
      sticker_number: sticker.number,
      owned: sticker.owned,
      quantity: sticker.quantity,
    },
    { onConflict: "user_id,sticker_number" },
  );
}

export const useStickerStore = create<StickerStore>((set) => ({
  stickers: mockStickers,
  loading: false,

  loadStickers: async () => {
    set({ loading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false });
      return;
    }
    const { data } = await supabase
      .from("user_stickers")
      .select("sticker_number, owned, quantity")
      .eq("user_id", user.id);

    const dbMap = new Map(
      (data ?? []).map((r) => [
        r.sticker_number,
        { owned: r.owned as boolean, quantity: r.quantity as number },
      ]),
    );

    const merged = mockStickers.map((s) => {
      const row = dbMap.get(s.number);
      return row ? { ...s, owned: row.owned, quantity: row.quantity } : s;
    });

    set({ stickers: merged, loading: false });
  },

  toggleOwned: (id) =>
    set((state) => {
      const stickers = state.stickers.map((s) =>
        s.id === id ? { ...s, owned: !s.owned, quantity: s.owned ? 0 : 1 } : s,
      );
      const updated = stickers.find((s) => s.id === id)!;
      upsertSticker(updated);
      return { stickers };
    }),

  incrementQuantity: (id) =>
    set((state) => {
      const stickers = state.stickers.map((s) =>
        s.id === id ? { ...s, owned: true, quantity: s.quantity + 1 } : s,
      );
      const updated = stickers.find((s) => s.id === id)!;
      upsertSticker(updated);
      return { stickers };
    }),

  decrementQuantity: (id) =>
    set((state) => {
      const stickers = state.stickers.map((s) =>
        s.id === id && s.quantity > 0
          ? { ...s, quantity: s.quantity - 1, owned: s.quantity > 1 }
          : s,
      );
      const updated = stickers.find((s) => s.id === id)!;
      upsertSticker(updated);
      return { stickers };
    }),
}));
