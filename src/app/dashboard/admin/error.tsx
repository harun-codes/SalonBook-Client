
"use client";

import { useEffect } from "react";
import ErrorState from "@/components/shared/feedback/error-state";

interface AdminErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function AdminError({
  error,
  reset,
}: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin Dashboard Error:", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <ErrorState
        title="Unable to Load Admin Dashboard"
        description="An unexpected error occurred while loading the admin dashboard. Please try again."
        onRetry={reset}
        retryLabel="Reload Dashboard"
        homeHref="/admin"
        homeLabel="Admin Home"
      />
    </div>
  );
}
