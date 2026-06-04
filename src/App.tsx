import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { useStickerStore } from "./store/useCounterStore";
import CollectionScreen from "./screens/CollectionScreen";
import DuplicatesScreen from "./screens/DuplicatesScreen";
import CompareScreen from "./screens/CompareScreen";
import AuthScreen from "./screens/AuthScreen";
import BottomNav from "./components/BottomNav";

export type Screen = "collection" | "duplicates" | "compare";

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("collection");
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [collectionHasUnsavedChanges, setCollectionHasUnsavedChanges] =
    useState(false);
  const [pendingScreen, setPendingScreen] = useState<Screen | null>(null);
  const { loadStickers } = useStickerStore();

  function handleNavigate(nextScreen: Screen) {
    if (nextScreen === activeScreen) return;
    const leavingCollection = activeScreen === "collection";
    if (leavingCollection && collectionHasUnsavedChanges) {
      setPendingScreen(nextScreen);
      return;
    }
    setActiveScreen(nextScreen);
  }

  function confirmDiscardAndLeave() {
    if (!pendingScreen) return;
    setCollectionHasUnsavedChanges(false);
    setActiveScreen(pendingScreen);
    setPendingScreen(null);
  }

  function stayOnCollection() {
    setPendingScreen(null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadStickers();
  }, [session]);

  useEffect(() => {
    if (!session?.user) return;
    const email = session.user.email?.toLowerCase();
    if (!email) return;

    void supabase.from("profiles").upsert(
      {
        id: session.user.id,
        email,
        display_name: session.user.user_metadata?.name ?? null,
      },
      { onConflict: "id" },
    );
  }, [session]);

  // Still resolving auth state
  if (session === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F2F2F7" }}
      >
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-[100dvh]" style={{ background: "#F2F2F7" }}>
      <div className="max-w-md mx-auto min-h-[100dvh] relative">
        {activeScreen === "collection" && (
          <CollectionScreen onUnsavedChanges={setCollectionHasUnsavedChanges} />
        )}
        {activeScreen === "duplicates" && <DuplicatesScreen />}
        {activeScreen === "compare" && <CompareScreen />}
        <BottomNav active={activeScreen} onNavigate={handleNavigate} />

        {pendingScreen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/35 px-4 pb-6 sm:pb-0">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
              <div className="px-5 pt-5 pb-3 text-center">
                <h3 className="text-[18px] font-semibold text-gray-900">
                  Leave without saving?
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you leave now, your collection edits will be lost.
                </p>
              </div>
              <div className="border-t border-gray-100">
                <button
                  onClick={confirmDiscardAndLeave}
                  className="w-full py-3.5 text-[17px] font-semibold text-red-500 border-none bg-transparent cursor-pointer"
                >
                  Continue
                </button>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={stayOnCollection}
                  className="w-full py-3.5 text-[17px] font-medium text-[#007AFF] border-none bg-transparent cursor-pointer"
                >
                  Stay Here
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
