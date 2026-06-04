import { Users, ArrowLeftRight, Clock } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    initials: "JS",
    color: "#5856D6",
    duplicates: 8,
    needs: 5,
  },
  {
    id: 2,
    name: "Maria Costa",
    initials: "MC",
    color: "#FF2D55",
    duplicates: 12,
    needs: 3,
  },
  {
    id: 3,
    name: "Pedro Santos",
    initials: "PS",
    color: "#FF9500",
    duplicates: 6,
    needs: 9,
  },
  {
    id: 4,
    name: "Ana Lima",
    initials: "AL",
    color: "#34C759",
    duplicates: 4,
    needs: 11,
  },
];

export default function CompareScreen() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 shadow-sm">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
          Compare
        </h1>
        <p className="text-[14px] text-gray-400 mt-0.5 font-medium">
          Trade duplicates with friends
        </p>
      </div>

      <div className="flex-1 px-4 pt-6 pb-28 overflow-y-auto">
        {/* Coming soon card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,122,255,0.10)" }}
            >
              <Clock size={36} color="#007AFF" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-gray-900">
                Coming Soon
              </h2>
              <p className="text-[14px] text-gray-400 mt-2 leading-relaxed max-w-xs">
                Connect with other collectors, compare duplicates and find the
                best trades to complete your album.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mt-4 pt-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-widest">
                Preview
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 opacity-50 pointer-events-none"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: user.color }}
                  >
                    <span className="text-[13px] font-bold text-white">
                      {user.initials}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-[12px] text-gray-400">
                      {user.duplicates} dups · needs {user.needs}
                    </p>
                  </div>

                  {/* Compare icon */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background: "rgba(0,122,255,0.10)" }}
                  >
                    <ArrowLeftRight size={13} color="#007AFF" />
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: "#007AFF" }}
                    >
                      Trade
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Friends section placeholder */}
        <div className="mt-4 bg-white rounded-3xl px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,122,255,0.10)" }}
            >
              <Users size={18} color="#007AFF" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-gray-900">
                Add Friends
              </p>
              <p className="text-[12px] text-gray-400">
                Connect via Supabase — coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
