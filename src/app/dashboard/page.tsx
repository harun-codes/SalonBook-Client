
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Clock3,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Appointment {
  _id: string;
  status: string;
}

interface AppointmentResponse {
  success: boolean;
  count: number;
  appointments: Appointment[];
  message?: string;
}

interface Statistics {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

const initialStatistics: Statistics = {
  total: 0,
  pending: 0,
  confirmed: 0,
  cancelled: 0,
};

export default function CustomerDashboardPage() {
  const [statistics, setStatistics] =
    useState<Statistics>(initialStatistics);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: authError } = await authClient.token();

      if (authError) {
        throw new Error(
          authError.message || "Authentication failed."
        );
      }

      if (!data?.token) {
        throw new Error("Please sign in to view your appointments.");
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/appointments/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result: AppointmentResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch appointments."
        );
      }

      const appointments = Array.isArray(result.appointments)
        ? result.appointments
        : [];

      const newStatistics: Statistics = {
        total: appointments.length,

        pending: appointments.filter(
          (appointment) =>
            appointment.status?.toLowerCase() === "pending"
        ).length,

        confirmed: appointments.filter(
          (appointment) =>
            appointment.status?.toLowerCase() === "confirmed"
        ).length,

        cancelled: appointments.filter(
          (appointment) =>
            appointment.status?.toLowerCase() === "cancelled"
        ).length,
      };

      setStatistics(newStatistics);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatistics();
  }, [fetchStatistics]);

  const statisticsCards = [
    {
      title: "Total Appointment Requests",
      value: statistics.total,
      icon: CalendarDays,
      color:
        "bg-[#E8FFF2] text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]",
    },
    {
      title: "Pending Appointments",
      value: statistics.pending,
      icon: Clock3,
      color:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Confirmed Appointments",
      value: statistics.confirmed,
      icon: CalendarCheck,
      color:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Cancelled Appointments",
      value: statistics.cancelled,
      icon: CalendarX,
      color:
        "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
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

        <button
          onClick={fetchStatistics}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>

          <button
            onClick={fetchStatistics}
            className="font-semibold underline underline-offset-4"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statisticsCards.map((stat) => {
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

                  <h3 className="mt-4 flex items-center gap-2 text-3xl font-extrabold tracking-tight text-foreground">
                    {loading ? (
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    ) : error ? (
                      "—"
                    ) : (
                      stat.value
                    )}
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
