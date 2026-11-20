
"use client";

import { useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { SearchX } from "lucide-react";
import ServiceFilters from "./service-filters";
import ServiceCard from "./service-card";
import type { Service, ServiceSortOption } from "@/types/service";

interface ServicesListProps {
  services: Service[];
}

export default function ServicesList({
  services,
}: ServicesListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] =
    useState<ServiceSortOption>("default");

  const selectedCategory =
    searchParams.get("category") || "all";

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [services]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    const query = params.toString();

    router.replace(
      query ? `${pathname}?${query}` : pathname,
      { scroll: false }
    );
  };

  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const result = services.filter((service) => {
      const matchesSearch = service.serviceName
        .toLowerCase()
        .includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        service.category.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "price-low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "price-high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, searchTerm, selectedCategory, sortOrder]);

  const clearFilters = () => {
    setSearchTerm("");
    setSortOrder("default");
    handleCategoryChange("all");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "all" ||
    sortOrder !== "default";

  return (
    <section className="space-y-6">
      <ServiceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-foreground">
            {filteredServices.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-foreground">
            {services.length}
          </span>{" "}
          services
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-[#075E46] transition-colors hover:text-[#064C39] dark:text-[#A7E8C5]"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold text-foreground">
            No Matching Services
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Try another service name or category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg bg-[#075E46] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#064C39]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
            />
          ))}
        </div>
      )}
    </section>
  );
}
