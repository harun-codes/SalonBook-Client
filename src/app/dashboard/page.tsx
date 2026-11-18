
import {
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Clock3,
} from "lucide-react";

const statistics = [
  {
    title: "Total Appointment Requests",
    value: "0",
    icon: CalendarDays,
    color: "bg-[#E8FFF2] text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]",
  },
  {
    title: "Pending Appointments",
    value: "0",
    icon: Clock3,
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    title: "Confirmed Appointments",
    value: "0",
    icon: CalendarCheck,
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  {
    title: "Cancelled Appointments",
    value: "0",
    icon: CalendarX,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  },
];

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-primary">
          CUSTOMER DASHBOARD
        </p>

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Dashboard Overview
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Track your appointments and manage your salon bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    {stat.title}
                  </p>

                  <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
