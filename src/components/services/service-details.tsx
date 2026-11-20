
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Clock3,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
    Loader2,
    ClipboardList,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

const TIME_SLOTS = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
];

function getDhakaToday() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    return `${year}-${month}-${day}`;
}

export default function ServiceDetails({
    service,
}: {
    service: Service;
}) {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [appointmentDate, setAppointmentDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [message, setMessage] = useState("");

    const [showBookingForm, setShowBookingForm] = useState(false);

    const [loading, setLoading] = useState(false);

    const isActive = service.status?.toLowerCase() === "active";

    const userRole = (
        session?.user as { role?: string } | undefined
    )?.role;

    const isCustomer = userRole === "customer";

    const handleBooking = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!session?.user || userRole !== "customer") {
            toast.error("Booking Not Allowed", {
                description:
                    "Only customer accounts can submit appointment requests.",
            });
            return;
        }

        if (!isActive) {
            toast.error("Service Unavailable", {
                description:
                    "This service is currently unavailable for booking.",
            });
            return;
        }

        if (!appointmentDate || !timeSlot) {
            toast.error("Missing Information", {
                description:
                    "Please select an appointment date and time.",
            });
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
            toast.error("Invalid Date", {
                description:
                    "Please select a valid appointment date.",
            });
            return;
        }

        if (appointmentDate < getDhakaToday()) {
            toast.error("Invalid Appointment Date", {
                description:
                    "Appointment date cannot be in the past.",
            });
            return;
        }

        if (!TIME_SLOTS.includes(timeSlot)) {
            toast.error("Invalid Time Slot", {
                description:
                    "Please select a valid time slot.",
            });
            return;
        }

        if (message.trim().length > 500) {
            toast.error("Message Too Long", {
                description:
                    "Message must not exceed 500 characters.",
            });
            return;
        }

        try {
            setLoading(true);

            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error(
                    tokenError?.message ||
                    "Your session has expired. Please sign in again."
                );
            }

            const apiUrl = (
                process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:5000"
            ).replace(/\/$/, "");

            const response = await fetch(
                `${apiUrl}/appointments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                    body: JSON.stringify({
                        serviceId: service._id,
                        appointmentDate,
                        timeSlot,
                        message: message.trim(),
                    }),
                }
            );

            const result = (await response.json().catch(() => null)) as {
                success?: boolean;
                message?: string;
                appointment?: {
                    _id?: string;
                };
            } | null;

            if (!response.ok) {
                const fallbackMessage =
                    response.status === 409
                        ? "This time slot is already booked. Please select another time slot."
                        : response.status === 401
                            ? "Your session has expired. Please sign in again."
                            : response.status === 403
                                ? "Only customer accounts can submit appointments."
                                : "Failed to create appointment. Please try again.";

                const errorDescription =
                    result?.message || fallbackMessage;

                if (response.status === 409) {
                    toast.error("Time Slot Unavailable", {
                        description: errorDescription,
                    });
                } else if (response.status === 401) {
                    toast.error("Session Expired", {
                        description: errorDescription,
                    });
                } else if (response.status === 403) {
                    toast.error("Booking Not Allowed", {
                        description: errorDescription,
                    });
                } else {
                    toast.error("Appointment Booking Failed", {
                        description: errorDescription,
                    });
                }

                return;
            }

            setAppointmentDate("");
            setTimeSlot("");
            setMessage("");

            toast.success("Appointment Requested Successfully!", {
                description:
                    "Your appointment request has been submitted and is waiting for admin confirmation.",
                duration: 5000,
            });

            router.push("/dashboard/customer/appointments");

        } catch (error) {
            console.error("Appointment booking error:", error);

            toast.error("Appointment Booking Failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

                <Link
                    href="/services"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
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

                            <span className="rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">
                                {service.category}
                            </span>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                    isActive
                                        ? "bg-secondary text-secondary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {isActive ? "Available" : "Unavailable"}
                            </span>

                        </div>

                        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
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

                                <h2 className="mt-2 text-2xl font-extrabold text-foreground">
                                    ৳{Number(service.price).toLocaleString("en-BD")}
                                </h2>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-5">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Estimated Duration
                                </p>

                                <h2 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-foreground">
                                    <Clock3 className="h-5 w-5 text-primary" />
                                    {service.duration} min
                                </h2>
                            </div>

                        </div>

                        <div className="rounded-2xl border border-border bg-card p-6">

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                                    <CalendarDays className="h-5 w-5 text-secondary-foreground" />
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

                            {!isActive ? (

                                <div className="mt-6 rounded-xl bg-muted p-4">
                                    <p className="text-sm font-semibold text-muted-foreground">
                                        This service is currently unavailable for booking.
                                    </p>
                                </div>

                            ) : isPending ? (

                                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-muted p-6 text-sm text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Checking your account...
                                </div>

                            ) : !session?.user ? (

                                <div className="mt-6">

                                    <div className="mb-5 flex items-start gap-3 rounded-xl bg-secondary p-4">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary-foreground" />

                                        <p className="text-sm leading-6 text-secondary-foreground">
                                            Please sign in to your customer account before requesting an appointment.
                                        </p>
                                    </div>

                                    <Link
                                        href={`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:opacity-90"
                                    >
                                        Sign In to Book
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>

                                </div>

                            ) : !isCustomer ? (

                                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />

                                        <p className="text-sm leading-6 text-amber-800 dark:text-amber-300">
                                            Only customer accounts can submit appointment requests. Admin accounts cannot book salon services.
                                        </p>
                                    </div>
                                </div>

                            ) : !showBookingForm ? (

                                <div className="mt-6 space-y-4">

                                    <p className="text-sm leading-6 text-muted-foreground">
                                        Ready to book this service? Select your preferred date and time to request an appointment.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:opacity-90"
                                    >
                                        Book Appointment
                                        <ArrowRight className="h-5 w-5" />
                                    </button>

                                </div>

                            ) : (

                                <form
                                    onSubmit={handleBooking}
                                    className="mt-6 space-y-5"
                                >

                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold">
                                            Complete Your Booking
                                        </h4>

                                        <button
                                            type="button"
                                            onClick={() => setShowBookingForm(false)}
                                            disabled={loading}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary disabled:opacity-50"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Back
                                        </button>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="appointmentDate"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Appointment Date
                                        </label>

                                        <input
                                            id="appointmentDate"
                                            type="date"
                                            min={getDhakaToday()}
                                            value={appointmentDate}
                                            onChange={(e) =>
                                                setAppointmentDate(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="timeSlot"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Available Time Slot
                                        </label>

                                        <select
                                            id="timeSlot"
                                            value={timeSlot}
                                            onChange={(e) =>
                                                setTimeSlot(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                                        >
                                            <option value="">
                                                Select a time slot
                                            </option>

                                            {TIME_SLOTS.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label
                                                htmlFor="message"
                                                className="text-sm font-semibold"
                                            >
                                                Additional Message
                                            </label>

                                            <span className="text-xs text-muted-foreground">
                                                {message.length}/500
                                            </span>
                                        </div>

                                        <textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            maxLength={500}
                                            rows={3}
                                            disabled={loading}
                                            placeholder="Write any special requests..."
                                            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 rounded-xl bg-muted p-4">
                                        <ClipboardList className="h-5 w-5 shrink-0 text-primary" />

                                        <div className="text-sm">
                                            <p className="font-semibold">
                                                ৳{Number(service.price).toLocaleString("en-BD")}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                Payment status will initially be unpaid.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !appointmentDate ||
                                            !timeSlot
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Submitting Request...
                                            </>
                                        ) : (
                                            <>
                                                Confirm Appointment
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs leading-5 text-muted-foreground">
                                        Your appointment will remain pending until confirmed by the admin.
                                    </p>

                                </form>

                            )}

                        </div>

                        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Professional salon and beauty services.
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}
