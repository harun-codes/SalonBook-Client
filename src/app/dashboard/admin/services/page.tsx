
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Clock3,
  Scissors,
  X,
  ImagePlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  Filter,
} from "lucide-react";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ServicesResponse {
  success: boolean;
  count?: number;
  services?: Service[];
  service?: Service;
  message?: string;
}

interface ServiceForm {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  status: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const initialForm: ServiceForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: "",
  status: "active",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
    null
  );

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        "Authentication required. Please sign in again."
      );
    }

    return data.token;
  };

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const params = new URLSearchParams();

      params.set("status", status);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `${API_URL}/admin/services?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: ServicesResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load services."
        );
      }

      setServices(
        Array.isArray(result.services) ? result.services : []
      );

      setTotal(result.count ?? 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchServices]);

  const openEditForm = async (id: string) => {
    try {
      setFormLoading(true);
      setFormError("");
      setEditingId(id);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/admin/services/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: ServicesResponse = await response.json();

      if (!response.ok || !result.success || !result.service) {
        throw new Error(
          result.message || "Failed to load service details."
        );
      }

      const service = result.service;

      setForm({
        serviceName: service.serviceName || "",
        category: service.category || "",
        description: service.description || "",
        price: String(service.price ?? ""),
        duration: String(service.duration ?? ""),
        image: service.image || "",
        status: service.status || "active",
      });

      setIsFormOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load service."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (
    field: keyof ServiceForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be less than 5MB.");
      return;
    }

    try {
      setUploadingImage(true);
      setFormError("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(
          result.message || "Image upload failed."
        );
      }

      setForm((previous) => ({
        ...previous,
        image: result.url,
      }));
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingId) return;

    try {
      setSaving(true);
      setFormError("");

      const token = await getToken();

      const payload = {
        serviceName: form.serviceName.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
        image: form.image.trim(),
        status: form.status,
      };

      const response = await fetch(
        `${API_URL}/admin/services/${editingId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result: ServicesResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update service."
        );
      }

      setNotice("Service updated successfully.");

      setIsFormOpen(false);
      setEditingId(null);
      setForm(initialForm);

      await fetchServices();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    const nextStatus =
      service.status?.toLowerCase() === "active"
        ? "inactive"
        : "active";

    try {
      setStatusUpdatingId(service._id);
      setError("");
      setNotice("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/admin/services/${service._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const result: ServicesResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update service status."
        );
      }

      setNotice(
        `Service ${
          nextStatus === "active" ? "activated" : "deactivated"
        } successfully.`
      );

      await fetchServices();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service status."
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/admin/services/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete service."
        );
      }

      setNotice("Service deleted successfully.");
      setDeleteTarget(null);

      await fetchServices();
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Failed to delete service."
      );
    } finally {
      setDeleting(false);
    }
  };

  const closeForm = () => {
    if (saving || uploadingImage) return;

    setIsFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setFormError("");
  };

  const formatPrice = (price: number) =>
    `৳${Number(price).toLocaleString("en-BD")}`;

  const activeCount = services.filter(
    (service) => service.status?.toLowerCase() === "active"
  ).length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Manage Services
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create, update and manage your salon services.
          </p>
        </div>

        <Link
          href="/dashboard/admin/services/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add New Service
        </Link>
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
          <p className="text-sm font-medium text-muted-foreground">
            Total Services
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-foreground">
            {loading ? "..." : total}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Active Services
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-foreground">
            {loading ? "..." : activeCount}
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
              placeholder="Search by service name or category..."
              className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-10 text-sm font-medium text-foreground outline-none focus:border-primary sm:w-44"
              >
                <option value="all">All Services</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              onClick={fetchServices}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
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
            onClick={fetchServices}
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
              All Services
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {total} services found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4"
              >
                <div className="h-14 w-14 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-3 w-1/4 rounded bg-muted" />
                </div>
                <div className="h-8 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Scissors className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-foreground">
              No Services Found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {search || status !== "all"
                ? "Try changing your search or status filter."
                : "Start by adding your first salon service."}
            </p>

            {!search && status === "all" && (
              <Link
                href="/dashboard/admin/services/add"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </Link>
            )}
          </div>
        ) : (
          <div className="w-full min-w-0">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-[44%] px-2 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:w-[36%] sm:px-3 sm:py-4 sm:text-xs md:w-[28%]">
                    Service
                  </th>

                  <th className="hidden px-2 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:table-cell sm:w-[19%] sm:py-4 md:w-[17%]">
                    Category
                  </th>

                  <th className="w-[17%] px-1 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:w-[14%] sm:px-2 sm:py-4 sm:text-xs md:w-[12%]">
                    Price
                  </th>

                  <th className="hidden px-2 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground md:table-cell md:w-[12%]">
                    Duration
                  </th>

                  <th className="w-[16%] px-1 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:w-[15%] sm:py-4 sm:text-xs md:w-[14%]">
                    Status
                  </th>

                  <th className="w-[23%] px-1 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:w-[16%] sm:py-4 sm:text-xs md:w-[17%]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {services.map((service) => {
                  const isActive =
                    service.status?.toLowerCase() === "active";

                  const isUpdatingStatus =
                    statusUpdatingId === service._id;

                  return (
                    <tr
                      key={service._id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="min-w-0 px-2 py-3 sm:px-3 sm:py-4">
                        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-12 sm:w-12 sm:rounded-xl">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.serviceName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Scissors className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-bold text-foreground sm:text-sm">
                              {service.serviceName}
                            </p>

                            <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground sm:text-xs">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="hidden min-w-0 px-2 py-4 sm:table-cell">
                        <span className="block truncate rounded-lg bg-muted px-2 py-1.5 text-[10px] font-semibold text-foreground sm:px-3 sm:text-xs">
                          {service.category}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-1 py-3 text-[10px] font-bold text-foreground sm:px-2 sm:py-4 sm:text-sm">
                        {formatPrice(service.price)}
                      </td>

                      <td className="hidden whitespace-nowrap px-2 py-4 md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock3 className="h-4 w-4 shrink-0" />
                          {service.duration} min
                        </div>
                      </td>

                      <td className="px-1 py-3 sm:py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(service)}
                          disabled={isUpdatingStatus}
                          aria-label={`Change ${service.serviceName} status to ${
                            isActive ? "inactive" : "active"
                          }`}
                          aria-pressed={isActive}
                          title={`Click to ${
                            isActive ? "deactivate" : "activate"
                          }`}
                          className={`inline-flex min-w-0 items-center justify-center gap-1 rounded-full px-1.5 py-1.5 text-[9px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:px-2.5 sm:text-xs ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70"
                              : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70"
                          }`}
                        >
                          {isUpdatingStatus ? (
                            <Loader2 className="h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5" />
                          ) : (
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                isActive
                                  ? "bg-emerald-600"
                                  : "bg-red-600"
                              }`}
                            />
                          )}

                          <span className="sm:hidden">
                            {isActive ? "On" : "Off"}
                          </span>

                          <span className="hidden sm:inline">
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>

                      <td className="px-1 py-3 sm:py-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(service._id)}
                            disabled={formLoading || isUpdatingStatus}
                            aria-label={`Edit ${service.serviceName}`}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-primary disabled:opacity-50 sm:h-9 sm:w-9"
                          >
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget(service);
                              setDeleteError("");
                            }}
                            disabled={isUpdatingStatus}
                            aria-label={`Delete ${service.serviceName}`}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30 sm:h-9 sm:w-9"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-2xl bg-card px-6 py-5 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Loading service details...
            </span>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-form-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2
                  id="service-form-title"
                  className="text-xl font-extrabold text-foreground"
                >
                  Edit Service
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Enter the service information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving || uploadingImage}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Service Name
                  </label>

                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.serviceName}
                    onChange={(event) =>
                      handleFormChange(
                        "serviceName",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Classic Haircut"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Category
                  </label>

                  <input
                    required
                    minLength={2}
                    maxLength={60}
                    value={form.category}
                    onChange={(event) =>
                      handleFormChange(
                        "category",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Hair Treatment"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Price (BDT)
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    step="any"
                    value={form.price}
                    onChange={(event) =>
                      handleFormChange("price", event.target.value)
                    }
                    placeholder="1500"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Duration (Minutes)
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={form.duration}
                    onChange={(event) =>
                      handleFormChange(
                        "duration",
                        event.target.value
                      )
                    }
                    placeholder="60"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Description
                </label>

                <textarea
                  required
                  maxLength={2000}
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    handleFormChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe this salon service..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary"
                />

                <p className="text-right text-xs text-muted-foreground">
                  {form.description.length}/2000 characters
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Service Image
                </label>

                <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-muted/20 p-4 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Service preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Upload service image
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      PNG, JPG or WEBP. Maximum file size 5MB.
                    </p>

                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {uploadingImage ? "Uploading..." : "Choose Image"}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {form.image && (
                  <button
                    type="button"
                    onClick={() => handleFormChange("image", "")}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Service Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    handleFormChange("status", event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving || uploadingImage}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {saving ? "Saving..." : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <Trash2 className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-foreground">
              Delete Service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">
                {deleteTarget.serviceName}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError("");
                }}
                disabled={deleting}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
