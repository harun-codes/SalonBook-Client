
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  ShieldCheck,
  ShieldBan,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Clock3,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface UsersResponse {
  success: boolean;
  message?: string;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  users?: Customer[];
  user?: Customer;
}

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

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date?: string) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function AccountBadge({ isBlocked }: { isBlocked: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
        isBlocked
          ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
}

function CustomerAvatar({
  customer,
  size = "normal",
}: {
  customer: Customer;
  size?: "normal" | "large";
}) {
  const sizeClass =
    size === "large" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 ${sizeClass}`}
    >
      {customer.image ? (
        <img
          src={customer.image}
          alt={customer.name}
          className="h-full w-full object-cover"
        />
      ) : (
        customer.name?.charAt(0)?.toUpperCase() || <UserRound />
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [blockedFilter, setBlockedFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [actionTarget, setActionTarget] = useState<Customer | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        search,
        blocked: blockedFilter,
      });

      const response = await fetch(
        `${API_URL}/admin/users?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: UsersResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch customers.");
      }

      setUsers(result.users || []);
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
  }, [page, search, blockedFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleViewDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/admin/users/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: UsersResponse = await response.json();

      if (!response.ok || !result.success || !result.user) {
        throw new Error(result.message || "Failed to fetch customer details.");
      }

      setSelectedUser(result.user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load customer details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAccountAction = async () => {
    if (!actionTarget) return;

    const action = actionTarget.isBlocked ? "unblock" : "block";

    try {
      setActionLoading(true);
      setActionError("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/admin/users/${actionTarget.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result: UsersResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update customer account.");
      }

      setNotice(
        action === "block"
          ? "Customer blocked successfully."
          : "Customer unblocked successfully."
      );

      if (result.user) {
        setSelectedUser(result.user);
      }

      setActionTarget(null);

      await fetchUsers();
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

  const handleFilterChange = (value: string) => {
    setBlockedFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-primary">
            ADMIN DASHBOARD
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage registered customers and their account access.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
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
              Customers Found
            </p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Users className="h-5 w-5" />
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
              <CalendarDays className="h-5 w-5" />
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
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, email or phone..."
              className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <select
            value={blockedFilter}
            onChange={(event) => handleFilterChange(event.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary md:w-52"
          >
            <option value="all">All Customers</option>
            <option value="false">Active Customers</option>
            <option value="true">Blocked Customers</option>
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
            onClick={fetchUsers}
            className="font-semibold underline"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-bold text-foreground">
            All Customers
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            {totalCount} customers found
          </p>
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
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-foreground">
              No Customers Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or account status filter.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-4 text-xs font-bold uppercase text-muted-foreground">
                    Customer
                  </th>

                  <th className="px-4 py-4 text-xs font-bold uppercase text-muted-foreground">
                    Phone
                  </th>

                  <th className="px-4 py-4 text-xs font-bold uppercase text-muted-foreground">
                    Joined
                  </th>

                  <th className="px-4 py-4 text-xs font-bold uppercase text-muted-foreground">
                    Account Status
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-bold uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {users.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <CustomerAvatar customer={customer} />

                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate text-sm font-bold text-foreground">
                            {customer.name}
                          </p>

                          <p className="mt-1 max-w-[200px] truncate text-xs text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {customer.phone || "Not provided"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(customer.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <AccountBadge isBlocked={customer.isBlocked} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(customer.id)}
                          disabled={detailsLoading}
                          title="View customer details"
                          aria-label="View customer details"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-muted hover:text-primary disabled:opacity-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActionTarget(customer);
                            setActionError("");
                          }}
                          title={
                            customer.isBlocked
                              ? "Unblock customer"
                              : "Block customer"
                          }
                          aria-label={
                            customer.isBlocked
                              ? "Unblock customer"
                              : "Block customer"
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                            customer.isBlocked
                              ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/40"
                              : "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                          }`}
                        >
                          {customer.isBlocked ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <ShieldBan className="h-4 w-4" />
                          )}
                        </button>
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
              Loading customer details...
            </span>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-details-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <h2
                id="customer-details-title"
                className="text-xl font-extrabold text-foreground"
              >
                Customer Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                aria-label="Close details"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <CustomerAvatar
                  customer={selectedUser}
                  size="large"
                />

                <h3 className="mt-3 text-lg font-extrabold text-foreground">
                  {selectedUser.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>

                <div className="mt-3">
                  <AccountBadge isBlocked={selectedUser.isBlocked} />
                </div>
              </div>

              <div className="space-y-4 rounded-xl bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Email Address
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone Number
                    </p>

                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {selectedUser.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Account Role
                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize text-foreground">
                      {selectedUser.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Registration Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDateTime(selectedUser.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActionTarget(selectedUser);
                    setActionError("");
                  }}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white ${
                    selectedUser.isBlocked
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {selectedUser.isBlocked
                    ? "Unblock Customer"
                    : "Block Customer"}
                </button>
              </div>
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
                actionTarget.isBlocked
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              }`}
            >
              {actionTarget.isBlocked ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <ShieldBan className="h-6 w-6" />
              )}
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-foreground">
              {actionTarget.isBlocked
                ? "Unblock Customer?"
                : "Block Customer?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {actionTarget.isBlocked
                ? `Are you sure you want to restore access for ${actionTarget.name}?`
                : `Are you sure you want to block ${actionTarget.name}? This customer will lose access to protected platform features.`}
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
                onClick={handleAccountAction}
                disabled={actionLoading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50 ${
                  actionTarget.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {actionLoading
                  ? "Processing..."
                  : actionTarget.isBlocked
                    ? "Unblock Customer"
                    : "Block Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
