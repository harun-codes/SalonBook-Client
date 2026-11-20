
"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  Scissors,
} from "lucide-react";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {

  useEffect(() => {
    console.error("SalonBook Application Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-xl text-center">

        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-950">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Something Went Wrong!
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          We encountered an unexpected problem while loading
          this page. Please try again.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Error Reference: {error.digest}
          </p>
        )}

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075E46] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#064C39]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>

        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <Scissors className="h-4 w-4 text-[#075E46] dark:text-[#A7E8C5]" />
          SalonBook | Beauty & Wellness
        </div>

      </div>
    </main>
  );
}
