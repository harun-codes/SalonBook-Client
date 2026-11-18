
import { ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({
  categories,
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
        Category
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-3.5 pr-10 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/15"
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
