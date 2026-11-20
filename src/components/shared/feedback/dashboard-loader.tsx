
export function DashboardLoader() {
  return (
    <main
      className="w-full space-y-7"
      role="status"
      aria-label="Loading dashboard"
      aria-live="polite"
    >
      <div className="space-y-3">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
            </div>

            <div className="mt-5 h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-44 animate-pulse rounded bg-muted" />
            <div className="h-3 w-64 max-w-full animate-pulse rounded bg-muted" />
          </div>

          <div className="h-10 w-full animate-pulse rounded-lg bg-muted sm:w-32" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-border pb-4 last:border-0"
            >
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-muted" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>

              <div className="hidden h-7 w-20 animate-pulse rounded-full bg-muted sm:block" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
