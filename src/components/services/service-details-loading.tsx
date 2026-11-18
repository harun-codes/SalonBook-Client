
export default function ServiceDetailsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-8 h-5 w-36 animate-pulse rounded bg-muted" />

        <div className="grid grid-cols-1 gap-9 lg:grid-cols-2">
          <div className="h-[350px] animate-pulse rounded-3xl bg-muted sm:h-[450px]" />

          <div className="space-y-6">
            <div className="h-8 w-36 animate-pulse rounded bg-muted" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />

            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 animate-pulse rounded-2xl bg-muted" />
              <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            </div>

            <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
