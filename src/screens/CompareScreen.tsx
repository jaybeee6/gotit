import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Plus, Trash2, Users } from "lucide-react";
import { useStickerStore } from "../store/useCounterStore";
import { supabase } from "../lib/supabase";

interface FriendLink {
  id: string;
  userId: string;
  email: string;
  name: string;
  initials: string;
  color: string;
}

interface FriendListState {
  loading: boolean;
  error: string | null;
  duplicates: string[];
  needs: string[];
}

interface ProfileRow {
  id: string;
  email: string;
  display_name: string | null;
}

interface StickerRow {
  sticker_number: string;
  owned: boolean;
  quantity: number;
}

const FRIENDS_STORAGE_KEY = "gotit.compare.friendLinks";
const AVATAR_COLORS = ["#007AFF", "#34C759", "#FF2D55", "#FF9500", "#5856D6"];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "FR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function CompareScreen() {
  const { stickers } = useStickerStore();
  const allCodes = useMemo(() => stickers.map((s) => s.number), [stickers]);

  const [friends, setFriends] = useState<FriendLink[]>(() => {
    const saved = localStorage.getItem(FRIENDS_STORAGE_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved) as FriendLink[];
    } catch {
      return [];
    }
  });
  const [friendLists, setFriendLists] = useState<
    Record<string, FriendListState>
  >({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const myDuplicateCodes = useMemo(
    () => stickers.filter((s) => s.quantity > 1).map((s) => s.number),
    [stickers],
  );
  const myNeedsCodes = useMemo(
    () => stickers.filter((s) => !s.owned).map((s) => s.number),
    [stickers],
  );

  function persistFriends(nextFriends: FriendLink[]) {
    setFriends(nextFriends);
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(nextFriends));
  }

  useEffect(() => {
    const ids = new Set(friends.map((f) => f.id));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFriendLists((prev) => {
      const next: Record<string, FriendListState> = {};
      for (const [id, state] of Object.entries(prev)) {
        if (ids.has(id)) next[id] = state;
      }
      return next;
    });
  }, [friends]);

  useEffect(() => {
    const missing = friends.filter((f) => !friendLists[f.id]);
    if (!missing.length) return;

    missing.forEach(async (friend) => {
      setFriendLists((prev) => ({
        ...prev,
        [friend.id]: { loading: true, error: null, duplicates: [], needs: [] },
      }));

      const { data, error } = await supabase
        .from("user_stickers")
        .select("sticker_number, owned, quantity")
        .eq("user_id", friend.userId);

      if (error) {
        setFriendLists((prev) => ({
          ...prev,
          [friend.id]: {
            loading: false,
            error: "Cannot read this user list yet. Check Supabase policies.",
            duplicates: [],
            needs: [],
          },
        }));
        return;
      }

      const rows = (data ?? []) as StickerRow[];
      const rowsByCode = new Map(
        rows.map((r) => [
          r.sticker_number,
          { owned: Boolean(r.owned), quantity: Number(r.quantity ?? 0) },
        ]),
      );

      const duplicates: string[] = [];
      const needs: string[] = [];
      for (const code of allCodes) {
        const row = rowsByCode.get(code);
        const owned = row?.owned ?? false;
        const quantity = row?.quantity ?? 0;
        if (quantity > 1) duplicates.push(code);
        if (!owned) needs.push(code);
      }

      setFriendLists((prev) => ({
        ...prev,
        [friend.id]: { loading: false, error: null, duplicates, needs },
      }));
    });
  }, [friends, friendLists, allCodes]);

  async function addFriendByEmail() {
    const email = friendEmail.trim().toLowerCase();
    setFormError(null);

    if (!isValidEmail(email)) {
      setFormError("Enter a valid email.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setFormError("You must be logged in.");
      return;
    }
    if (user.email?.toLowerCase() === email) {
      setFormError("You cannot add yourself.");
      return;
    }
    if (friends.some((f) => f.email.toLowerCase() === email)) {
      setFormError("This friend is already added.");
      return;
    }

    setAdding(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, display_name")
      .eq("email", email)
      .maybeSingle();
    setAdding(false);

    if (error) {
      setFormError(
        "Cannot search users yet. Please configure profiles table/policies.",
      );
      return;
    }

    if (!data) {
      setFormError("User not found. Ask your friend to log in at least once.");
      return;
    }

    const profile = data as ProfileRow;
    const displayName =
      profile.display_name?.trim() || profile.email.split("@")[0] || "Friend";

    const nextFriend: FriendLink = {
      id: crypto.randomUUID(),
      userId: profile.id,
      email: profile.email,
      name: displayName,
      initials: getInitials(displayName),
      color: AVATAR_COLORS[friends.length % AVATAR_COLORS.length],
    };

    persistFriends([nextFriend, ...friends]);
    setFriendEmail("");
    setShowAddModal(false);
  }

  function removeFriend(friendId: string) {
    const next = friends.filter((f) => f.id !== friendId);
    persistFriends(next);
    setFriendLists((prev) => {
      const copy = { ...prev };
      delete copy[friendId];
      return copy;
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white px-5 pt-14 pb-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
              Compare
            </h1>
            <p className="text-[14px] text-gray-400 mt-0.5 font-medium">
              Add friends by email and compare lists
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-[13px] font-semibold cursor-pointer border-none"
            style={{ background: "#007AFF" }}
          >
            <Plus size={14} />
            Add Friend
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6 pb-28 overflow-y-auto">
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
          <p className="text-[12px] text-gray-400 font-medium">Your Status</p>
          <div className="mt-2 flex items-center gap-6">
            <div>
              <p className="text-[24px] font-bold text-gray-900">
                {myDuplicateCodes.length}
              </p>
              <p className="text-[12px] text-gray-400">dups</p>
            </div>
            <div>
              <p className="text-[24px] font-bold text-gray-900">
                {myNeedsCodes.length}
              </p>
              <p className="text-[12px] text-gray-400">needs</p>
            </div>
          </div>
        </div>

        {friends.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,122,255,0.10)" }}
            >
              <Users size={24} color="#007AFF" />
            </div>
            <h2 className="mt-4 text-[18px] font-bold text-gray-900">
              No friends yet
            </h2>
            <p className="mt-1 text-[13px] text-gray-400 max-w-xs">
              Tap Add Friend and use their registered email.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {friends.map((friend) => {
              const list = friendLists[friend.id];
              const friendDuplicates = list?.duplicates ?? [];
              const friendNeeds = list?.needs ?? [];
              const giveCodes = myDuplicateCodes.filter((code) =>
                friendNeeds.includes(code),
              );
              const receiveCodes = friendDuplicates.filter((code) =>
                myNeedsCodes.includes(code),
              );
              const possibleTrades = Math.min(
                giveCodes.length,
                receiveCodes.length,
              );

              return (
                <div
                  key={friend.id}
                  className="bg-white rounded-3xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: friend.color }}
                    >
                      <span className="text-[13px] font-bold text-white">
                        {friend.initials}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-gray-900">
                        {friend.name}
                      </p>
                      <p className="text-[12px] text-gray-400">
                        {friendDuplicates.length} dups, needs{" "}
                        {friendNeeds.length}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {friend.email}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer bg-gray-100"
                      aria-label={`Remove ${friend.name}`}
                    >
                      <Trash2 size={14} className="text-gray-500" />
                    </button>
                  </div>

                  <div
                    className="mt-3 rounded-2xl px-3 py-2.5 flex items-center gap-2"
                    style={{ background: "rgba(52,199,89,0.12)" }}
                  >
                    <ArrowLeftRight size={15} color="#34C759" />
                    {list?.loading ? (
                      <p className="text-[13px] font-semibold text-green-700">
                        Loading friend list...
                      </p>
                    ) : list?.error ? (
                      <p className="text-[13px] font-semibold text-red-600">
                        {list.error}
                      </p>
                    ) : (
                      <p className="text-[13px] font-semibold text-green-700">
                        {possibleTrades} possible trade
                        {possibleTrades === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        You give (your dups they need)
                      </p>
                      <p className="mt-1 text-[12px] text-gray-700 break-words">
                        {!list || list.loading
                          ? "Loading..."
                          : giveCodes.length > 0
                            ? giveCodes.join(", ")
                            : "No matching codes"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        You receive (their dups you need)
                      </p>
                      <p className="mt-1 text-[12px] text-gray-700 break-words">
                        {!list || list.loading
                          ? "Loading..."
                          : receiveCodes.length > 0
                            ? receiveCodes.join(", ")
                            : "No matching codes"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[70] bg-black/35 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl">
            <h3 className="text-[20px] font-bold text-gray-900">Add Friend</h3>
            <p className="text-[12px] text-gray-400 mt-1">
              Enter the email your friend uses in this app.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide ml-1">
                  Friend Email
                </label>
                <input
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@email.com"
                  className="mt-1 w-full bg-gray-100 rounded-xl px-3.5 py-2.5 text-[14px] text-gray-900 border-none outline-none"
                />
              </div>
            </div>

            {formError && (
              <p className="mt-3 text-[13px] text-red-500">{formError}</p>
            )}

            <div className="mt-5 flex gap-2.5">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormError(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 text-[14px] font-semibold border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={addFriendByEmail}
                disabled={adding}
                className="flex-1 py-3 rounded-xl text-white text-[14px] font-semibold border-none cursor-pointer disabled:opacity-50"
                style={{ background: "#007AFF" }}
              >
                {adding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
