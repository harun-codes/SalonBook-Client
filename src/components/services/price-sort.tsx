
import { ArrowDownUp } from "lucide-react";
import type { ServiceSortOption } from "@/types/service";

interface PriceSortProps {
  value: ServiceSortOption;
  onChange: (value: ServiceSortOption) => void;
}

export default function PriceSort({
  value,
  onChange,
}: PriceSortProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
        Sort By Price
      </label>

      <div className="relative">
        <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value as ServiceSortOption)
          }
          className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/15"
        >
          <option value="default">Default</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
