
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  RefreshCw,
  ReceiptText,
  UserRound,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

interface Transaction {
  _id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string | null;
  timeSlot: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  paymentStatus: string;
  transactionStatus: string;
  transactionDate: string | null;
}

interface TransactionsResponse {
  success: boolean;
  count?: number;
  transactions?: Transaction[];
  message?: string;
}

type DisplayStatus = "paid" | "failed" | "expired" | "unpaid";

function getPaymentStatus(
  transaction: Transaction
): DisplayStatus {
  const paymentStatus = transaction.paymentStatus?.toLowerCase();
  const transactionStatus =
    transaction.transactionStatus?.toLowerCase();

  if (
    paymentStatus === "paid" ||
    transactionStatus === "paid"
  ) {
    return "paid";
  }

  if (
    paymentStatus === "failed" ||
    transactionStatus === "failed"
  ) {
    return "failed";
  }

  if (transactionStatus === "expired") {
    return "expired";
  }

  return "unpaid";
}

function PaymentBadge({ status }: { status: DisplayStatus }) {
  const styles: Record<DisplayStatus, string> = {
    paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    failed: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    expired:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    unpaid:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  };

  const labels: Record<DisplayStatus, string> = {
    paid: "Paid",
    failed: "Failed",
    expired: "Expired",
    unpaid: "Unpaid",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status === "paid" ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : status === "failed" || status === "expired" ? (
        <AlertCircle className="h-3.5 w-3.5" />
      ) : (
        <Clock3 className="h-3.5 w-3.5" />
      )}
      {labels[status]}
    </span>
  );
}

function formatDate(
  value: string | null,
  includeTime = false
) {
  if (!value) return "—";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(
    "en-BD",
    includeTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
  ).format(date);
}

function formatPrice(amount: number, currency: string) {
  const normalizedCurrency = currency?.toUpperCase() || "BDT";

  if (normalizedCurrency === "BDT") {
    return `৳${Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
    }).format(amount);
  } catch {
    return `${amount} ${normalizedCurrency}`;
  }
}

function shortenSessionId(value: string) {
  if (!value) return "—";

  if (value.length <= 22) return value;

  return `${value.slice(0, 12)}...${value.slice(-7)}`;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const getToken = useCallback(async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        "Authentication required. Please sign in again."
      );
    }

    return data.token;
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/admin/transactions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: TransactionsResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch transactions."
        );
      }

      setTransactions(
        Array.isArray(result.transactions)
          ? result.transactions
          : []
      );
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTransactions();
  }, [fetchTransactions]);

  const paidCount = transactions.filter(
    (transaction) =>
      getPaymentStatus(transaction) === "paid"
  ).length;

  const unpaidCount = transactions.filter(
    (transaction) =>
      getPaymentStatus(transaction) === "unpaid"
  ).length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
         
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            View and monitor all customer payment transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchTransactions()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="flex-1">{pageError}</p>

          <button
            type="button"
            onClick={() => setPageError("")}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-foreground">
                {loading ? "—" : transactions.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ReceiptText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Successful Payments
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-emerald-600">
                {loading ? "—" : paidCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Unpaid Transactions
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-amber-600">
                {loading ? "—" : unpaidCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
              <Clock3 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground">
            All Transactions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading transactions..."
              : `${transactions.length} transactions found`}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />

            <p className="text-sm text-muted-foreground">
              Loading transactions...
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <CreditCard className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-foreground">
              No transactions found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Customer payment transactions will appear here after they make payments.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1150px] text-left">
                <thead className="border-b border-border bg-muted/40">
                  <tr className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-4 py-4">Service</th>
                    <th className="px-4 py-4">Appointment</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Stripe Session</th>
                    <th className="px-4 py-4">Payment Status</th>
                    <th className="px-4 py-4">Transaction Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {transactions.map((transaction) => {
                    const status = getPaymentStatus(transaction);

                    return (
                      <tr
                        key={transaction._id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <UserRound className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-foreground">
                                {transaction.customerName}
                              </p>

                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {transaction.customerEmail || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="max-w-[180px] text-sm font-semibold text-foreground">
                            {transaction.serviceName}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(transaction.appointmentDate)}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {transaction.timeSlot || "—"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-foreground">
                          {formatPrice(
                            transaction.amount,
                            transaction.currency
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            title={transaction.stripeSessionId}
                            className="font-mono text-xs text-muted-foreground"
                          >
                            {shortenSessionId(
                              transaction.stripeSessionId
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <PaymentBadge status={status} />
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                          {formatDate(
                            transaction.transactionDate,
                            true
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:hidden">
              {transactions.map((transaction) => {
                const status = getPaymentStatus(transaction);

                return (
                  <article
                    key={transaction._id}
                    className="min-w-0 rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-foreground">
                            {transaction.customerName}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {transaction.customerEmail || "—"}
                          </p>
                        </div>
                      </div>

                      <PaymentBadge status={status} />
                    </div>

                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Service
                        </p>

                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {transaction.serviceName}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Appointment Date
                          </p>

                          <p className="mt-1 text-sm font-medium text-foreground">
                            {formatDate(transaction.appointmentDate)}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {transaction.timeSlot || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Payment Amount
                          </p>

                          <p className="mt-1 text-sm font-bold text-foreground">
                            {formatPrice(
                              transaction.amount,
                              transaction.currency
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Stripe Checkout Session
                        </p>

                        <p
                          title={transaction.stripeSessionId}
                          className="mt-1 break-all font-mono text-xs text-foreground"
                        >
                          {transaction.stripeSessionId || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Transaction Date
                        </p>

                        <p className="mt-1 text-sm text-foreground">
                          {formatDate(
                            transaction.transactionDate,
                            true
                          )}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
