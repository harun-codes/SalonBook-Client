
import ServiceSearch from "./service-search";
import CategoryFilter from "./category-filter";
import PriceSort from "./price-sort";
import type { ServiceSortOption } from "@/types/service";

interface ServiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortOrder: ServiceSortOption;
  setSortOrder: (value: ServiceSortOption) => void;
}

export default function ServiceFilters({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
}: ServiceFiltersProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Search Services
          </label>

          <ServiceSearch
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <CategoryFilter
          categories={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />

        <PriceSort
          value={sortOrder}
          onChange={setSortOrder}
        />
      </div>
    </div>
  );
}
