
import { Search, X } from "lucide-react";

interface ServiceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ServiceSearch({
  value,
  onChange,
}: ServiceSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search services by name..."
        aria-label="Search services by name"
        className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/15"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
