
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Clock3,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface Appointment {
  _id: string;
  status: string;
}

interface AppointmentsResponse {
  success: boolean;
  count?: number;
  appointments?: Appointment[];
  message?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: authError } = await authClient.token();

      if (authError || !data?.token) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/appointments/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        cache: "no-store",
      });

      const result: AppointmentsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load appointments."
        );
      }

      setAppointments(
        Array.isArray(result.appointments)
          ? result.appointments
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, [fetchAppointments]);

  const getCount = (status: string) =>
    appointments.filter(
      (appointment) =>
        appointment.status?.toLowerCase() === status
    ).length;

  const statistics = [
    {
      title: "Total Appointment Requests",
      value: appointments.length,
      icon: CalendarDays,
      color:
        "bg-[#E8FFF2] text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]",
    },
    {
      title: "Pending Appointments",
      value: getCount("pending"),
      icon: Clock3,
      color:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Confirmed Appointments",
      value: getCount("confirmed"),
      icon: CalendarCheck,
      color:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Cancelled Appointments",
      value: getCount("cancelled"),
      icon: CalendarX,
      color:
        "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-8">

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm font-semibold text-primary">
            CUSTOMER DASHBOARD
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Track your appointments and manage your salon bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>

      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>

          <button
            type="button"
            onClick={fetchAppointments}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                    {stat.title}
                  </p>

                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {loading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </h2>
                </div>

                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
