
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  return (
    <article className="group mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#075E46]/40 hover:shadow-lg dark:hover:border-[#A7E8C5]/40 sm:max-w-none">

      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={service.image}
          alt={service.serviceName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-[#E8FFF2]/95 px-3 py-1.5 text-[11px] font-semibold text-[#075E46] shadow-sm backdrop-blur-sm dark:bg-[#203B2E]/95 dark:text-[#A7E8C5]">
            {service.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h2 className="text-lg font-extrabold leading-snug text-[#032D22] dark:text-[#B7F7D4]">
            {service.serviceName}
          </h2>

          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {service.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">
              Price
            </p>

            <p className="mt-0.5 text-xl font-extrabold text-[#032D22] dark:text-[#B7F7D4]">
              ৳{service.price.toLocaleString("en-BD")}
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#E8FFF2] px-2.5 py-1.5 text-xs font-semibold text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]">
            <Clock3 className="h-3.5 w-3.5" />
            {service.duration} min
          </div>
        </div>

        <Link
          href={`/services/${service._id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#075E46] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#064C39] hover:shadow-md dark:hover:bg-[#087456]"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
