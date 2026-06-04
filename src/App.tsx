import { useState } from "react";
import CollectionScreen from "./screens/CollectionScreen";
import DuplicatesScreen from "./screens/DuplicatesScreen";
import CompareScreen from "./screens/CompareScreen";
import BottomNav from "./components/BottomNav";

export type Screen = "collection" | "duplicates" | "compare";

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("collection");

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
