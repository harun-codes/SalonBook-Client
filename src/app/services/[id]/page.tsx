
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import ServiceDetails, {
  type Service,
} from "@/components/services/service-details";
import ServiceDetailsLoading from "@/components/services/service-details-loading";

async function getService(id: string): Promise<Service | null> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const response = await fetch(
      `${apiUrl}/services/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

function ServiceNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8FFF2] dark:bg-[#203B2E]">
          <SearchX className="h-9 w-9 text-[#075E46] dark:text-[#A7E8C5]" />
        </div>

        <h1 className="text-3xl font-extrabold text-foreground">
          Service Not Found
        </h1>

        <p className="mt-4 leading-7 text-muted-foreground">
          The service you are looking for does not exist or could not be loaded.
          Please check the service link and try again.
        </p>

        <Link
          href="/services"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#075E46] px-6 py-3 font-semibold text-white hover:bg-[#064B39]"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Services
        </Link>

      </div>
    </main>
  );
}

async function ServiceDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return <ServiceNotFound />;
  }

  return <ServiceDetails service={service} />;
}

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ServiceDetailsLoading />}>
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
