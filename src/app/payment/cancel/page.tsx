
"use client";

import Link from "next/link";
import {
    XCircle,
    CalendarDays,
    RefreshCw,
    Home,
    ArrowRight,
} from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
            <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-10">

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                    <XCircle className="h-14 w-14 text-amber-600 dark:text-amber-400" />
                </div>

                <h1 className="mt-6 text-3xl font-bold text-foreground">
                    Payment Cancelled
                </h1>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Your payment was not completed. No successful payment has been confirmed for this checkout session.
                </p>

                <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left dark:border-amber-900 dark:bg-amber-950">
                    <div className="flex items-start gap-3">
                        <RefreshCw className="mt-0.5 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />

                        <div>
                            <p className="font-bold text-amber-800 dark:text-amber-300">
                                Your Appointment Is Not Cancelled
                            </p>

                            <p className="mt-2 text-sm leading-6 text-amber-700 dark:text-amber-400">
                                Cancelling the payment does not cancel your appointment. If your appointment is confirmed, it will remain confirmed with an unpaid payment status.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <Link
                        href="/dashboard/customer/appointments"
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        <CalendarDays className="h-5 w-5" />
                        Return to My Appointments
                        <ArrowRight className="h-5 w-5" />
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-4 font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                        <Home className="h-5 w-5" />
                        Back to Home
                    </Link>
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                    You can try completing your payment again from My Appointments.
                </p>
            </div>
        </main>
    );
}
