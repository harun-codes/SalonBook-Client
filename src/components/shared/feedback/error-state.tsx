
"use client";

import Link from "next/link";
import {
  AlertCircle,
  Home,
  RefreshCw,
} from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  homeHref?: string;
  homeLabel?: string;
}

export default function ErrorState({
  title = "Something Went Wrong",
  description = "We couldn't load the requested information. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  homeHref,
  homeLabel = "Go to Home",
}: ErrorStateProps) {
  return (
    <div
      className="flex min-h-[350px] items-center justify-center rounded-2xl border border-border bg-card px-5 py-12"
      role="alert"
    >
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-foreground">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075E46] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#064C39]"
            >
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </button>
          )}

          {homeHref && (
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              {homeLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
