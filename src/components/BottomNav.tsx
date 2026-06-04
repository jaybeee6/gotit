import { LayoutGrid, Layers, Users } from "lucide-react";
import type { Screen } from "../App";

interface Props {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}

const tabs: { id: Screen; label: string; Icon: React.ElementType }[] = [
  { id: "collection", label: "Collection", Icon: LayoutGrid },
  { id: "duplicates", label: "Duplicates", Icon: Layers },
  { id: "compare", label: "Compare", Icon: Users },
];

export default function BottomNav({ active, onNavigate }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div
          className="border-t border-gray-200/70 px-2"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex pb-safe">
            {tabs.map(({ id, label, Icon }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className="flex-1 flex flex-col items-center gap-0.5 pt-3 pb-2 cursor-pointer border-none bg-transparent"
                >
                  <Icon
                    size={24}
                    color={isActive ? "#007AFF" : "#8E8E93"}
                    strokeWidth={isActive ? 2.2 : 1.6}
                  />
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: isActive ? "#007AFF" : "#8E8E93" }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
