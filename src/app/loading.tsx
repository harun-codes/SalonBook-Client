
import { Scissors, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center bg-background px-5"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#E8FFF2] dark:bg-[#203B2E]">
          <Scissors className="h-11 w-11 text-[#075E46] dark:text-[#A7E8C5]" />

          <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#075E46] shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          SalonBook
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Preparing your beauty experience...
        </p>

        <div className="mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#075E46] dark:bg-[#A7E8C5]" />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#075E46] dark:bg-[#A7E8C5]" />
          Loading, please wait...
        </div>
      </div>
    </main>
  );
}
