
import { Suspense } from "react";
import {
  Scissors,
  Sparkles,
} from "lucide-react";
import ServicesList from "@/components/services/services-list";
import type { Service } from "@/types/service";

async function getServices(): Promise<Service[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const response = await fetch(`${apiUrl}/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid services response");
  }

  return data.filter(
    (service: Service) => service.status === "active"
  );
}

function ServicesLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-5 h-9 w-40 animate-pulse rounded-full bg-muted" />

          <div className="h-12 w-72 max-w-full animate-pulse rounded-lg bg-muted" />

          <div className="mt-5 h-12 w-full max-w-2xl animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="mb-6 h-24 animate-pulse rounded-2xl bg-muted" />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="h-44 animate-pulse bg-muted" />

              <div className="space-y-4 p-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-10 animate-pulse rounded bg-muted" />
                <div className="h-8 animate-pulse rounded bg-muted" />
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

async function ServicesContent() {
  let services: Service[] = [];
  let error = false;

  try {
    services = await getServices();
  } catch {
    error = true;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E8FFF2] px-4 py-2 text-xs font-semibold text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]">
            <Sparkles className="h-4 w-4" />
            Beauty & Wellness
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore Our Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Discover our wide range of professional salon services.
            From hair styling to skincare, find the perfect treatment
            to enhance your beauty and confidence.
          </p>

          {!error && (
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#075E46] dark:text-[#A7E8C5]">
              <Scissors className="h-4 w-4" />
              {services.length} Services Available
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <Scissors className="mx-auto h-10 w-10 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Unable to Load Services
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please check your backend server and try again.
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />

            <h2 className="mt-4 text-xl font-semibold text-foreground">
              No Services Available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please check back later for our available services.
            </p>
          </div>
        ) : (
          <ServicesList services={services} />
        )}

      </section>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <ServicesContent />
    </Suspense>
  );
}
