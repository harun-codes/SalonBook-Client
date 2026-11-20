
"use client";

import { useEffect } from "react";
import ErrorState from "@/components/shared/feedback/error-state";

interface DashboardErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  useEffect(() => {
    console.error("Customer Dashboard Error:", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <ErrorState
        title="Unable to Load Dashboard"
        description="Something went wrong while loading your dashboard. Please try again."
        onRetry={reset}
        retryLabel="Reload Dashboard"
        homeHref="/dashboard"
        homeLabel="Dashboard Home"
      />
    </div>
  );
}
