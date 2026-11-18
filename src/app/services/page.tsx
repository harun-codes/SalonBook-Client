
import { Suspense } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Clock3,
    Scissors,
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

                    <div className="mt-6 h-5 w-36 animate-pulse rounded bg-muted" />
                </div>

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
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {services.map((service) => (
                            <article
                                key={service._id}
                                className="group mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#075E46]/40 hover:shadow-lg dark:hover:border-[#A7E8C5]/40 sm:max-w-none"
                            >

                                <div className="relative h-44 overflow-hidden bg-muted">

                                    <img
                                        src={service.image}
                                        alt={service.serviceName}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute left-3 top-3">
                                        <span className="rounded-full bg-[#E8FFF2]/95 px-3 py-1.5 text-[11px] font-semibold text-[#075E46] shadow-sm backdrop-blur-sm dark:bg-[#203B2E]/95 dark:text-[#A7E8C5]">
                                            {service.category}
                                        </span>
                                    </div>

                                </div>

                                <div className="flex flex-1 flex-col p-4">

                                    <div className="flex-1">

                                        <h2 className="text-lg font-extrabold leading-snug text-[#032D22] dark:text-[#B7F7D4]">
                                            {service.serviceName}
                                        </h2>

                                        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
                                            {service.description}
                                        </p>

                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">

                                        <div>
                                            <p className="text-[11px] font-medium text-muted-foreground">
                                                Price
                                            </p>

                                            <p className="mt-0.5 text-xl font-extrabold text-[#032D22] dark:text-[#B7F7D4]">
                                                ৳{service.price.toLocaleString("en-BD")}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5 rounded-full bg-[#E8FFF2] px-2.5 py-1.5 text-xs font-semibold text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {service.duration} min
                                        </div>

                                    </div>

                                    <Link
                                        href={`/services/${service._id}`}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#075E46] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#064C39] hover:shadow-md dark:bg-[#075E46] dark:text-white dark:hover:bg-[#087456]"
                                    >
                                        View Details
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>

                                </div>

                            </article>
                        ))}

                    </div>
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
