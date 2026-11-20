
import Link from "next/link";
import {
  Inbox,
  type LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "No Data Found",
  description = "There is currently no information available to display.",
  icon: Icon = Inbox,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8FFF2] dark:bg-[#203B2E]">
          <Icon className="h-8 w-8 text-[#075E46] dark:text-[#A7E8C5]" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-foreground">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>

        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#075E46] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#064C39]"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
