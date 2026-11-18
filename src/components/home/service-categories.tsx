
import Link from "next/link";
import {
  ArrowUpRight,
  Brush,
  Clock,
  Droplets,
  Hand,
  Palette,
  Scissors,
  Sparkles,
  Waves,
} from "lucide-react";

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  status: string;
}

const categories = [
  {
    name: "Haircut & Styling",
    description: "Discover professional haircuts and styling services.",
    icon: Scissors,
  },
  {
    name: "Hair Coloring",
    description: "Refresh your look with beautiful hair colors.",
    icon: Palette,
  },
  {
    name: "Hair Treatment",
    description: "Nourish and restore your hair with expert care.",
    icon: Droplets,
  },
  {
    name: "Facial & Skincare",
    description: "Give your skin the care and attention it deserves.",
    icon: Sparkles,
  },
  {
    name: "Makeup",
    description: "Enhance your beauty with professional makeup.",
    icon: Brush,
  },
  {
    name: "Manicure & Pedicure",
    description: "Enjoy beautiful nails and relaxing nail care.",
    icon: Hand,
  },
  {
    name: "Spa & Massage",
    description: "Relax, refresh and experience complete wellness.",
    icon: Waves,
  },
];

async function getCategoryCounts() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const response = await fetch(`${apiUrl}/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch service categories");
  }

  const services: Service[] = await response.json();

  const activeServices = services.filter(
    (service) => service.status === "active"
  );

  return categories.map((category) => ({
    ...category,
    count: activeServices.filter(
      (service) =>
        service.category.trim().toLowerCase() ===
        category.name.toLowerCase()
    ).length,
  }));
}

export async function ServiceCategories() {
  let categoryItems = categories.map((category) => ({
    ...category,
    count: 0,
  }));

  let error = false;

  try {
    categoryItems = await getCategoryCounts();
  } catch {
    error = true;
  }

  return (
    <section className="bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        <div className="mb-9 flex flex-col gap-4 sm:mb-11">

          <div className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.15em] text-[#075E46] dark:text-[#A7E8C5]">
            <Sparkles className="h-4 w-4" />
            EXPLORE CATEGORIES
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Explore Services by Category
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Find the perfect salon treatment for your needs.
                Explore our wide range of beauty, hair and wellness
                categories.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#075E46] dark:text-[#A7E8C5]"
            >
              Browse All Services
              <ArrowUpRight className="h-4 w-4" />
            </Link>

          </div>
        </div>

        {error && (
          <p className="mb-5 text-sm text-muted-foreground">
            Service counts are temporarily unavailable.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {categoryItems.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-[#075E46]/40 hover:shadow-md dark:hover:border-[#A7E8C5]/40 sm:p-6"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8FFF2] dark:bg-[#203B2E]">
                    <Icon className="h-6 w-6 text-[#075E46] dark:text-[#A7E8C5]" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-[#075E46] dark:group-hover:text-[#A7E8C5]" />

                </div>

                <div className="mt-6">

                  <h3 className="text-lg font-extrabold text-[#032D22] dark:text-[#B7F7D4]">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#075E46] dark:text-[#A7E8C5]">
                    <Clock className="h-3.5 w-3.5" />

                    {error
                      ? "Explore services"
                      : `${category.count} active ${category.count === 1 ? "service" : "services"}`}
                  </div>

                </div>

              </Link>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export function ServiceCategoriesSkeleton() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[190px] animate-pulse rounded-2xl border border-border bg-muted"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
