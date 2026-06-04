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
  const { loadStickers } = useStickerStore();

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
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="max-w-md mx-auto min-h-screen relative">
        {activeScreen === "collection" && <CollectionScreen />}
        {activeScreen === "duplicates" && <DuplicatesScreen />}
        {activeScreen === "compare" && <CompareScreen />}
        <BottomNav active={activeScreen} onNavigate={setActiveScreen} />
      </div>
    </div>
  );
}

export default App;
