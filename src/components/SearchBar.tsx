import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 h-9">
      <Search size={15} color="#8E8E93" strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none border-none min-w-0"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center border-none cursor-pointer p-0 shrink-0"
        >
          <X size={10} color="white" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
