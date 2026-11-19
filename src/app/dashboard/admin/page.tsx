
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock3,
  CalendarCheck,
  CreditCard,
  RefreshCw,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface DashboardStats {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalSuccessfulPayments: number;
}

interface StatsResponse {
  success: boolean;
  stats?: DashboardStats;
  message?: string;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const { data, error: authError } = await authClient.token();

      if (authError || !data?.token) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/admin/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        }
      );

      const result: StatsResponse = await response.json();

      if (!response.ok || !result.success || !result.stats) {
        throw new Error(
          result.message || "Failed to load dashboard statistics."
        );
      }

      setStats(result.stats);
      setError("");
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
    void fetchStats();
  }, [fetchStats]);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    void fetchStats();
  };

  const statistics = [
    {
      title: "Registered Customers",
      key: "totalCustomers" as const,
      icon: Users,
      color:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Services",
      key: "totalActiveServices" as const,
      icon: Scissors,
      color:
        "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Total Appointment Requests",
      key: "totalAppointments" as const,
      icon: CalendarDays,
      color:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
    {
      title: "Pending Appointments",
      key: "pendingAppointments" as const,
      icon: Clock3,
      color:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Confirmed Appointments",
      key: "confirmedAppointments" as const,
      icon: CalendarCheck,
      color:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Successful Payments",
      key: "totalSuccessfulPayments" as const,
      icon: CreditCard,
      color:
        "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>

            <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

          <p className="text-sm font-semibold text-primary">
            ADMIN DASHBOARD
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Welcome to SalonBook Admin Portal. Monitor your salon activities
            and performance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
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
          className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.key}
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
                      (stats?.[stat.key] ?? 0).toLocaleString()
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
