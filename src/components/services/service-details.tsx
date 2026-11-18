
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Clock3,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

export interface Service {
    _id: string;
    serviceName: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    status: string;
}

export default function ServiceDetails({
    service,
}: {
    service: Service;
}) {
    const isActive = service.status?.toLowerCase() === "active";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

                <Link
                    href="/services"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#075E46] dark:hover:text-[#A7E8C5]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Services
                </Link>

                <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-2 lg:gap-14">

                    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        {service.image ? (
                            <img
                                src={service.image}
                                alt={service.serviceName}
                                className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[480px]"
                            />
                        ) : (
                            <div className="flex h-[300px] items-center justify-center bg-muted sm:h-[400px] lg:h-[480px]">
                                <Sparkles className="h-14 w-14 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">

                        <div className="mb-5 flex flex-wrap items-center gap-3">

                            <span className="rounded-full bg-[#E8FFF2] px-4 py-2 text-sm font-bold text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]">
                                {service.category}
                            </span>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${isActive
                                    ? "bg-[#E8FFF2] text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]"
                                    : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {isActive ? "Available" : "Unavailable"}
                            </span>

                        </div>

                        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#032D22] dark:text-[#B7F7D4] sm:text-4xl lg:text-5xl">
                            {service.serviceName}
                        </h1>

                        <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                            {service.description}
                        </p>

                        <div className="my-8 grid grid-cols-2 gap-4">

                            <div className="rounded-2xl border border-border bg-card p-5">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Service Price
                                </p>

                                <h2 className="mt-2 text-2xl font-extrabold text-[#032D22] dark:text-[#B7F7D4]">
                                    ৳{Number(service.price).toLocaleString("en-BD")}
                                </h2>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-5">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Estimated Duration
                                </p>

                                <h2 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-foreground">
                                    <Clock3 className="h-5 w-5 text-[#075E46] dark:text-[#A7E8C5]" />
                                    {service.duration} min
                                </h2>
                            </div>

                        </div>

                        <div className="rounded-2xl border border-border bg-card p-6">

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8FFF2] dark:bg-[#203B2E]">
                                    <CalendarDays className="h-5 w-5 text-[#075E46] dark:text-[#A7E8C5]" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold">
                                        Appointment Booking
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Book your preferred salon service.
                                    </p>
                                </div>
                            </div>

                            {isActive ? (
                                <div className="mt-6">

                                    <div className="mb-5 flex items-start gap-3 rounded-xl bg-[#E8FFF2] p-4 dark:bg-[#203B2E]">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#075E46] dark:text-[#A7E8C5]" />

                                        <p className="text-sm leading-6 text-[#075E46] dark:text-[#A7E8C5]">
                                            Sign in will be required before you can request an appointment.
                                        </p>
                                    </div>

                                    <Link
                                        href={`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#075E46] px-6 py-4 font-bold text-white hover:bg-[#064B39] dark:bg-[#075E46] dark:hover:bg-[#096D52]"
                                    >
                                        Book Appointment
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>

                                </div>
                            ) : (
                                <div className="mt-6 rounded-xl bg-muted p-4">
                                    <p className="text-sm font-semibold text-muted-foreground">
                                        This service is currently unavailable for booking.
                                    </p>
                                </div>
                            )}

                        </div>

                        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-[#075E46] dark:text-[#A7E8C5]" />
                            Professional salon and beauty services.
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}
