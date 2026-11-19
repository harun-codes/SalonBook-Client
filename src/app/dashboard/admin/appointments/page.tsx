
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  UserRound,
  Scissors,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Appointment {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  service?: {
    serviceName?: string;
    category?: string;
    image?: string;
    duration?: number;
  } | null;
  customer?: {
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    image?: string;
  } | null;
}

interface AppointmentResponse {
  success: boolean;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  appointments?: Appointment[];
  appointment?: Appointment;
  message?: string;
}

type AppointmentAction = {
  appointment: Appointment;
  action: "confirm" | "cancel";
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const LIMIT = 10;

const getToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please sign in again.");
  }

  return data.token;
};

const formatPrice = (price: number) =>
  `৳${Number(price || 0).toLocaleString("en-BD")}`;

const formatDate = (date: string) => {
  if (!date) return "N/A";

  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const formatDateTime = (date: string) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getCustomerName = (appointment: Appointment) =>
  appointment.customer?.name ||
  appointment.customer?.fullName ||
  "Unknown Customer";

const getServiceName = (appointment: Appointment) =>
  appointment.service?.serviceName || "Service unavailable";

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";

    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";

    case "cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";

    default:
      return "bg-muted text-muted-foreground";
  }
};

const getPaymentStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";

    case "unpaid":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";

    case "refunded":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

    default:
      return "bg-muted text-muted-foreground";
  }
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
        status
      )}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getPaymentStyle(
        status
      )}`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [actionTarget, setActionTarget] =
    useState<AppointmentAction | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(
        `${API_URL}/admin/appointments?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: AppointmentResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch appointments."
        );
      }

      setAppointments(result.appointments || []);
      setTotalCount(result.count || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = appointments.filter((appointment) => {
    const searchText = search.toLowerCase();

    return (
      getCustomerName(appointment).toLowerCase().includes(searchText) ||
      getServiceName(appointment).toLowerCase().includes(searchText) ||
      (appointment.customer?.email || "")
        .toLowerCase()
        .includes(searchText) ||
      appointment._id.toLowerCase().includes(searchText)
    );
  });

  const handleViewDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/admin/appointments/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: AppointmentResponse = await response.json();

      if (!response.ok || !result.success || !result.appointment) {
        throw new Error(
          result.message || "Failed to fetch appointment details."
        );
      }

      setSelectedAppointment(result.appointment);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load appointment details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAppointmentAction = async () => {
    if (!actionTarget) return;

    try {
      setActionLoading(true);
      setActionError("");

      const token = await getToken();

      const { appointment, action } = actionTarget;

      const response = await fetch(
        `${API_URL}/admin/appointments/${appointment._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update appointment."
        );
      }

      setNotice(
        action === "confirm"
          ? "Appointment confirmed successfully."
          : "Appointment cancelled successfully."
      );

      setActionTarget(null);

      await fetchAppointments();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
    setSearch("");
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Manage Appointments
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View and manage customer appointment requests.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {notice}
          </div>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {statusFilter === "all"
                ? "Total Appointments"
                : `${statusFilter} Appointments`}
            </p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Current Page
            </p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-foreground">
            {loading ? "..." : `${page} / ${totalPages}`}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, service or ID..."
              className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              handleStatusFilter(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary md:w-52"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>

          <button
            type="button"
            onClick={fetchAppointments}
            className="font-semibold underline"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-bold text-foreground">
              All Appointments
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {totalCount} appointments found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-5 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-3 w-1/4 rounded bg-muted" />
                </div>
                <div className="h-8 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-foreground">
              No Appointments Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="w-full min-w-0">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-[34%] px-2 py-4 text-[10px] font-bold uppercase text-muted-foreground sm:w-[22%] sm:px-3 sm:text-xs">
                    Customer
                  </th>

                  <th className="w-[34%] px-2 py-4 text-[10px] font-bold uppercase text-muted-foreground sm:w-[19%] sm:text-xs">
                    Service
                  </th>

                  <th className="hidden px-2 py-4 text-xs font-bold uppercase text-muted-foreground md:table-cell md:w-[15%]">
                    Date & Time
                  </th>

                  <th className="hidden px-2 py-4 text-xs font-bold uppercase text-muted-foreground lg:table-cell lg:w-[11%]">
                    Amount
                  </th>

                  <th className="hidden px-2 py-4 text-xs font-bold uppercase text-muted-foreground lg:table-cell lg:w-[12%]">
                    Payment
                  </th>

                  <th className="w-[17%] px-1 py-4 text-[10px] font-bold uppercase text-muted-foreground sm:w-[14%] sm:text-xs">
                    Status
                  </th>

                  <th className="w-[15%] px-1 py-4 text-center text-[10px] font-bold uppercase text-muted-foreground sm:w-[12%] sm:text-xs">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="min-w-0 px-2 py-4 sm:px-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 sm:flex">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-bold text-foreground sm:text-sm">
                            {getCustomerName(appointment)}
                          </p>

                          <p className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">
                            {appointment.customer?.email || "No email"}
                          </p>

                          <p className="mt-1 text-[9px] text-muted-foreground md:hidden">
                            {formatDate(appointment.appointmentDate)}
                            {" · "}
                            {appointment.timeSlot}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="min-w-0 px-2 py-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted sm:flex">
                          {appointment.service?.image ? (
                            <img
                              src={appointment.service.image}
                              alt={getServiceName(appointment)}
                              className="h-full w-full rounded-lg object-cover"
                            />
                          ) : (
                            <Scissors className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold text-foreground sm:text-sm">
                            {getServiceName(appointment)}
                          </p>

                          <p className="mt-1 truncate text-[9px] text-muted-foreground lg:hidden">
                            {formatPrice(appointment.servicePrice)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="hidden px-2 py-4 md:table-cell">
                      <p className="whitespace-nowrap text-xs font-semibold text-foreground">
                        {formatDate(appointment.appointmentDate)}
                      </p>

                      <p className="mt-1 whitespace-nowrap text-xs text-muted-foreground">
                        {appointment.timeSlot}
                      </p>
                    </td>

                    <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-bold text-foreground lg:table-cell">
                      {formatPrice(appointment.servicePrice)}
                    </td>

                    <td className="hidden px-2 py-4 lg:table-cell">
                      <PaymentBadge status={appointment.paymentStatus} />
                    </td>

                    <td className="px-1 py-4 sm:px-2">
                      <StatusBadge status={appointment.status} />
                    </td>

                    <td className="px-1 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewDetails(appointment._id)
                          }
                          disabled={detailsLoading}
                          title="View details"
                          aria-label="View appointment details"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-muted hover:text-primary disabled:opacity-50 sm:h-9 sm:w-9"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>

                        {appointment.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setActionTarget({
                                  appointment,
                                  action: "confirm",
                                });
                                setActionError("");
                              }}
                              title="Confirm appointment"
                              aria-label="Confirm appointment"
                              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/40 sm:flex"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActionTarget({
                                  appointment,
                                  action: "cancel",
                                });
                                setActionError("");
                              }}
                              title="Cancel appointment"
                              aria-label="Cancel appointment"
                              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40 sm:flex"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {appointment.status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActionTarget({
                                appointment,
                                action: "cancel",
                              });
                              setActionError("");
                            }}
                            title="Cancel appointment"
                            aria-label="Cancel appointment"
                            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40 sm:flex"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-4 sm:flex-row sm:px-5">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {detailsLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-2xl bg-card px-6 py-5 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Loading appointment details...
            </span>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-details-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6">
              <div>
                <h2
                  id="appointment-details-title"
                  className="text-xl font-extrabold text-foreground"
                >
                  Appointment Details
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  ID: {selectedAppointment._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                aria-label="Close details"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-6">
              <div>
                <h3 className="mb-3 text-sm font-bold text-foreground">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 gap-4 rounded-xl bg-muted/40 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Customer Name
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {getCustomerName(selectedAppointment)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-foreground">
                      {selectedAppointment.customer?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {selectedAppointment.customer?.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Customer ID
                    </p>
                    <p className="mt-1 break-all text-xs font-medium text-foreground">
                      {selectedAppointment.customerId}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold text-foreground">
                  Service Information
                </h3>

                <div className="flex items-center gap-4 rounded-xl bg-muted/40 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                    {selectedAppointment.service?.image ? (
                      <img
                        src={selectedAppointment.service.image}
                        alt={getServiceName(selectedAppointment)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Scissors className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-foreground">
                      {getServiceName(selectedAppointment)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedAppointment.service?.category || "N/A"}
                    </p>

                    <p className="mt-1 text-sm font-bold text-primary">
                      {formatPrice(selectedAppointment.servicePrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold text-foreground">
                  Appointment Information
                </h3>

                <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/40 p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Appointment Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDate(
                        selectedAppointment.appointmentDate
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Time Slot
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {selectedAppointment.timeSlot}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Appointment Status
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={selectedAppointment.status} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Payment Status
                    </p>
                    <div className="mt-2">
                      <PaymentBadge
                        status={selectedAppointment.paymentStatus}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">
                      Booking Created
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDateTime(selectedAppointment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold text-foreground">
                  Customer Message
                </h3>

                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {selectedAppointment.message || "No message provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-border px-5 py-4 sm:flex-row sm:px-6">
              {selectedAppointment.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActionTarget({
                        appointment: selectedAppointment,
                        action: "cancel",
                      });
                      setActionError("");
                    }}
                    className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                  >
                    Cancel Appointment
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActionTarget({
                        appointment: selectedAppointment,
                        action: "confirm",
                      });
                      setActionError("");
                    }}
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
                  >
                    Confirm Appointment
                  </button>
                </>
              )}

              {selectedAppointment.status === "confirmed" && (
                <button
                  type="button"
                  onClick={() => {
                    setActionTarget({
                      appointment: selectedAppointment,
                      action: "cancel",
                    });
                    setActionError("");
                  }}
                  className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                >
                  Cancel Appointment
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {actionTarget && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                actionTarget.action === "confirm"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              }`}
            >
              {actionTarget.action === "confirm" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-foreground">
              {actionTarget.action === "confirm"
                ? "Confirm Appointment?"
                : "Cancel Appointment?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {actionTarget.action === "confirm"
                ? `Are you sure you want to confirm the appointment for ${getCustomerName(
                    actionTarget.appointment
                  )}?`
                : `Are you sure you want to cancel the appointment for ${getCustomerName(
                    actionTarget.appointment
                  )}?`}
            </p>

            {actionError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {actionError}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!actionLoading) {
                    setActionTarget(null);
                    setActionError("");
                  }
                }}
                disabled={actionLoading}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleAppointmentAction}
                disabled={actionLoading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50 ${
                  actionTarget.action === "confirm"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {actionLoading
                  ? "Processing..."
                  : actionTarget.action === "confirm"
                    ? "Confirm"
                    : "Cancel Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
