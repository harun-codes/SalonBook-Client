
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Sparkles,
} from "lucide-react";

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
}

async function getFeaturedServices(): Promise<Service[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const response = await fetch(`${apiUrl}/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch featured services");
  }

  const data: Service[] = await response.json();

  return data
    .filter((service) => service.status === "active")
    .slice(0, 6);
}

export async function FeaturedServices() {
  let services: Service[] = [];
  let error = false;

  try {
    services = await getFeaturedServices();
  } catch {
    error = true;
  }

  return (
    <section className="bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        <div className="mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-2xl">

            <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold tracking-[0.15em] text-[#075E46] dark:text-[#A7E8C5]">
              <Sparkles className="h-4 w-4" />
              FEATURED SERVICES
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Explore Our Popular Services
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Discover our handpicked beauty and wellness treatments.
              Find your favorite service and enjoy a relaxing salon experience.
            </p>

          </div>

          <Link
            href="/services"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#075E46] px-5 py-3 text-sm font-semibold text-[#032D22] transition-colors hover:bg-[#E8FFF2] dark:border-[#A7E8C5] dark:text-[#B7F7D4] dark:hover:bg-[#203B2E]"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        {error ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-foreground">
              Unable to Load Featured Services
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Please check your backend connection and try again.
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-foreground">
              No Featured Services Available
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Our featured salon services will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">

            {services.map((service) => (
              <article
                key={service._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >

                <div className="relative h-44 overflow-hidden bg-muted">

                  <img
                    src={service.image}
                    alt={service.serviceName}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-[#E8FFF2]/95 px-3 py-1.5 text-[11px] font-semibold text-[#075E46] shadow-sm backdrop-blur-sm dark:bg-[#203B2E]/95 dark:text-[#A7E8C5]">
                      {service.category}
                    </span>
                  </div>

                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">

                  <div className="flex-1">

                    <h3 className="text-lg font-extrabold leading-snug text-[#032D22] dark:text-[#B7F7D4]">
                      {service.serviceName}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>

                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-extrabold text-[#032D22] dark:text-[#B7F7D4]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full bg-[#E8FFF2] px-3 py-2 text-xs font-semibold text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]">
                      <Clock3 className="h-4 w-4" />
                      {service.duration} min
                    </div>

                  </div>

                  <Link
                    href={`/services/${service._id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#075E46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#064C39] dark:bg-[#075E46] dark:text-white dark:hover:bg-[#087456]"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export function FeaturedServicesSkeleton() {
  return (
    <section className="bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        <div className="mb-9 space-y-3">
          <div className="h-4 w-36 rounded bg-muted" />
          <div className="h-9 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full max-w-xl rounded bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="h-44 bg-muted" />

              <div className="space-y-4 p-5">
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
                <div className="h-10 w-full rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
