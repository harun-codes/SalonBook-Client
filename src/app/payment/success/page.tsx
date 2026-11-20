
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    Loader2,
    AlertCircle,
    CalendarDays,
    RefreshCw,
    ArrowRight,
    Home,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type VerificationStatus = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
    const [status, setStatus] =
        useState<VerificationStatus>("loading");

    const [message, setMessage] = useState(
        "Please wait while we verify your payment."
    );

    const [sessionId, setSessionId] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    const requestRef = useRef("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("session_id");

        if (!id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStatus("error");
            setMessage("Payment session ID was not found.");
            return;
        }

        setSessionId(id);
    }, []);

    useEffect(() => {
        if (!sessionId) return;

        const requestKey = `${sessionId}:${retryCount}`;

        if (requestRef.current === requestKey) return;

        requestRef.current = requestKey;

        const verifyPayment = async () => {
            try {
                setStatus("loading");
                setMessage("Please wait while we verify your payment.");

                const { data, error } = await authClient.token();

                if (error || !data?.token) {
                    throw new Error(
                        error?.message || "Authentication failed. Please sign in again."
                    );
                }

                const apiUrl = (
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:5000"
                ).replace(/\/+$/, "");

                const response = await fetch(
                    `${apiUrl}/payments/checkout-verify`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${data.token}`,
                        },
                        body: JSON.stringify({
                            sessionId,
                        }),
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                const alreadyVerified =
                    /already verified|already paid/i.test(
                        result.message || ""
                    );

                if (
                    (!response.ok || !result.success) &&
                    !alreadyVerified
                ) {
                    throw new Error(
                        result.message || "Payment verification failed."
                    );
                }

                setStatus("success");

                setMessage(
                    alreadyVerified
                        ? "Your payment has already been verified successfully."
                        : "Your payment has been verified successfully. Your appointment payment status is now Paid."
                );

            } catch (error) {
                console.error("Payment verification error:", error);

                setStatus("error");

                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to verify your payment. Please try again."
                );
            }
        };

        verifyPayment();
    }, [sessionId, retryCount]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
            <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-10">

                {status === "loading" && (
                    <>
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        </div>

                        <h1 className="mt-6 text-2xl font-bold text-foreground">
                            Verifying Your Payment
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {message}
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                            <CheckCircle2 className="h-14 w-14 text-green-600 dark:text-green-400" />
                        </div>

                        <h1 className="mt-6 text-3xl font-bold text-foreground">
                            Payment Successful!
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            Thank you for choosing SalonBook. Your payment has been successfully verified and your appointment payment status has been updated.
                        </p>

                        <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5 text-left dark:border-green-900 dark:bg-green-950">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400" />

                                <div>
                                    <p className="font-bold text-green-800 dark:text-green-300">
                                        Payment Completed
                                    </p>

                                    <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                                        Your transaction has been verified.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-5 break-all text-xs text-muted-foreground">
                            Session ID: {sessionId}
                        </p>

                        <Link
                            href="/dashboard/customer/appointments"
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            <CalendarDays className="h-5 w-5" />
                            My Appointments
                            <ArrowRight className="h-5 w-5" />
                        </Link>

                        <Link
                            href="/"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                            <AlertCircle className="h-14 w-14 text-red-600 dark:text-red-400" />
                        </div>

                        <h1 className="mt-6 text-2xl font-bold text-foreground">
                            Payment Verification Failed
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            {message}
                        </p>

                        <div className="mt-7 flex flex-col gap-3">
                            {sessionId && (
                                <button
                                    onClick={() => setRetryCount((prev) => prev + 1)}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                    Retry Verification
                                </button>
                            )}

                            <Link
                                href="/dashboard/customer/appointments"
                                className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-4 font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                                <CalendarDays className="h-5 w-5" />
                                My Appointments
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
