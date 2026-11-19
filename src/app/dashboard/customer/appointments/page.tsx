
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    Clock3,
    Scissors,
    Loader2,
    XCircle,
    CheckCircle2,
    AlertCircle,
    ClipboardList,
    RefreshCw,
    ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface AppointmentService {
    serviceName: string;
    category: string;
    image?: string;
    price?: number;
    duration?: number;
}

interface Appointment {
    _id: string;
    serviceId: string;
    customerId: string;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
    servicePrice: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    service: AppointmentService | null;
}

interface AppointmentResponse {
    success: boolean;
    count: number;
    appointments: Appointment[];
    message?: string;
}

function formatDate(date: string) {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(
        Date.UTC(year, month - 1, day)
    ).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "short",
        timeZone: "UTC",
    });
}

function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";

        case "confirmed":
            return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300";

        case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";

        case "completed":
            return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";

        default:
            return "bg-muted text-muted-foreground";
    }
}

export default function MyAppointmentsPage() {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [cancellingId, setCancellingId] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (sessionLoading) return;

        let active = true;

        const fetchAppointments = async () => {
            try {
                setLoading(true);
                setError("");

                if (!session?.user) {
                    setAppointments([]);
                    setError("Please sign in to view your appointments.");
                    return;
                }

                const { data: tokenData, error: tokenError } =
                    await authClient.token();

                if (tokenError || !tokenData?.token) {
                    throw new Error(
                        tokenError?.message || "Unable to authenticate your request."
                    );
                }

                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                const response = await fetch(`${apiUrl}/appointments/my`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                    cache: "no-store",
                });

                const result: AppointmentResponse = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to fetch appointments."
                    );
                }

                if (active) {
                    setAppointments(result.appointments || []);
                }
            } catch (err) {
                console.error("Fetch appointments error:", err);

                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchAppointments();

        return () => {
            active = false;
        };
    }, [sessionLoading, session?.user, refreshKey]);

    const handleCancel = async (appointmentId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(appointmentId);
            setActionError("");

            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                throw new Error(
                    tokenError?.message || "Authentication failed."
                );
            }

            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

            const response = await fetch(
                `${apiUrl}/appointments/${encodeURIComponent(appointmentId)}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to cancel appointment."
                );
            }

            setAppointments((previous) =>
                previous.map((appointment) =>
                    appointment._id === appointmentId
                        ? {
                            ...appointment,
                            status: result.appointment?.status || "cancelled",
                        }
                        : appointment
                )
            );
        } catch (err) {
            console.error("Cancel appointment error:", err);

            setActionError(
                err instanceof Error
                    ? err.message
                    : "Unable to cancel appointment."
            );
        } finally {
            setCancellingId("");
        }
    };

    const pendingCount = appointments.filter(
        (appointment) => appointment.status.toLowerCase() === "pending"
    ).length;

    const confirmedCount = appointments.filter(
        (appointment) => appointment.status.toLowerCase() === "confirmed"
    ).length;

    const cancelledCount = appointments.filter(
        (appointment) => appointment.status.toLowerCase() === "cancelled"
    ).length;

    return (
        <div>
           
            <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        My Appointments
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        View and manage your salon appointments.
                    </p>
                </div>

                <button
                    onClick={() => setRefreshKey((previous) => previous + 1)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {!loading && !error && (
                <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Appointments
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-foreground">
                            {appointments.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Pending
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-amber-600">
                            {pendingCount}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Confirmed
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-green-600">
                            {confirmedCount}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Cancelled
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-red-600">
                            {cancelledCount}
                        </h2>
                    </div>
                </div>
            )}

            {actionError && (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {actionError}
                </div>
            )}

            {loading ? (
                <div className="mt-8 flex min-h-[250px] items-center justify-center rounded-2xl border border-border bg-card">
                    <div className="text-center">
                        <Loader2 className="mx-auto h-9 w-9 animate-spin text-primary" />

                        <p className="mt-4 text-sm font-medium text-muted-foreground">
                            Loading your appointments...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-destructive" />

                    <h2 className="mt-4 text-lg font-bold text-foreground">
                        Unable to Load Appointments
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error}
                    </p>

                    <button
                        onClick={() => setRefreshKey((previous) => previous + 1)}
                        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        Try Again
                    </button>
                </div>
            ) : appointments.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                        <CalendarDays className="h-8 w-8 text-primary" />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-foreground">
                        No Appointments Yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        You haven&apos;t booked any salon services yet. Explore our services
                        and book your first appointment.
                    </p>

                    <Link
                        href="/services"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        Browse Services
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            ) : (
                <div className="mt-8 space-y-5">
                    {appointments.map((appointment) => (


                        <article
                            key={appointment._id}
                            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                        >
                            <div className="flex items-start gap-4">

                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-32">
                                    {appointment.service?.image ? (
                                        <img
                                            src={appointment.service.image}
                                            alt={appointment.service.serviceName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Scissors className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                                {appointment.service?.category || "Salon Service"}
                                            </p>

                                            <h2 className="mt-1 truncate text-base font-bold text-foreground sm:text-lg">
                                                {appointment.service?.serviceName || "Service Unavailable"}
                                            </h2>
                                        </div>

                                        <span
                                            className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                                                appointment.status
                                            )}`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 xl:grid-cols-4">

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Appointment Date
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                                                <p className="text-sm font-semibold text-foreground">
                                                    {formatDate(appointment.appointmentDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Appointment Time
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Clock3 className="h-4 w-4 shrink-0 text-primary" />
                                                <p className="text-sm font-semibold text-foreground">
                                                    {appointment.timeSlot}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Service Price
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <ClipboardList className="h-4 w-4 shrink-0 text-primary" />
                                                <p className="text-sm font-bold text-foreground">
                                                    ৳{Number(appointment.servicePrice).toLocaleString("en-BD")}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Payment Status
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                                <p className="text-sm font-semibold capitalize text-foreground">
                                                    {appointment.paymentStatus}
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    {appointment.message && (
                                        <p className="mt-3 truncate rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">Message:</span>{" "}
                                            {appointment.message}
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">

                                        <p className="min-w-0 truncate text-xs text-muted-foreground">
                                            Booking ID: {appointment._id}
                                        </p>

                                        {appointment.status.toLowerCase() === "pending" && (
                                            <button
                                                onClick={() => handleCancel(appointment._id)}
                                                disabled={cancellingId === appointment._id}
                                                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                                            >
                                                {cancellingId === appointment._id ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Cancelling...
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-4 w-4" />
                                                        Cancel
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {appointment.status.toLowerCase() === "cancelled" && (
                                            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                                <XCircle className="h-4 w-4" />
                                                Cancelled
                                            </span>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </article>

                    ))}
                </div>
            )}
        </div>
    );
}
