
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Scissors,
  ImagePlus,
  Upload,
  X,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Banknote,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { uploadServiceImage } from "@/lib/upload-image";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

interface ServiceForm {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  status: "active" | "inactive";
}

interface ApiResponse {
  success: boolean;
  message?: string;
  service?: {
    _id?: string;
  };
}

const INITIAL_FORM: ServiceForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  status: "active",
};

export default function AddServicePage() {
  const router = useRouter();

  const [form, setForm] = useState<ServiceForm>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const imagePreview = useMemo(
    () => imageFile ? URL.createObjectURL(imageFile) : "",
    [imageFile]
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setError("");
    setSuccess("");
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const serviceName = form.serviceName.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const duration = Number(form.duration);

    if (!serviceName) {
      setError("Please enter a service name.");
      return;
    }

    if (!form.category) {
      setError("Please select a service category.");
      return;
    }

    if (!description) {
      setError("Please enter a service description.");
      return;
    }

    if (!form.price || !Number.isFinite(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    if (
      !form.duration ||
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      setError("Duration must be a positive whole number.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a service image.");
      return;
    }

    try {
      setLoading(true);

      const { data, error: authError } = await authClient.token();

      if (authError || !data?.token) {
        throw new Error(
          "Authentication required. Please sign in again."
        );
      }

      const imageUrl = await uploadServiceImage(imageFile);

      const response = await fetch(`${API_URL}/admin/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName,
          category: form.category,
          description,
          price,
          duration,
          image: imageUrl,
          status: form.status,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create service."
        );
      }

      setSuccess(
        result.message || "Service created successfully."
      );

      setForm(INITIAL_FORM);
      setImageFile(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-7">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Add New Service
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create a new salon service and make it available for customers.
          </p>
        </div>

        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {success}
          </div>

          <Link
            href="/dashboard/admin/services"
            className="font-semibold underline"
          >
            View Services
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
      >
        <div className="mb-7 flex items-center gap-3 border-b border-border pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Scissors className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-foreground">
              Service Information
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Enter the details of your new salon service.
            </p>
          </div>
        </div>

        <div className="space-y-6">

          <div>
            <label
              htmlFor="serviceName"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Service Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="serviceName"
              name="serviceName"
              type="text"
              value={form.serviceName}
              onChange={handleChange}
              placeholder="e.g. Premium Hair Spa"
              maxLength={100}
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Service Category
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
            >
              <option value="" disabled>
                Select a category
              </option>

              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Description
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the service, its benefits and what customers can expect..."
              rows={5}
              maxLength={1000}
              required
              disabled={loading}
              className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
            />

            <p className="mt-1 text-right text-xs text-muted-foreground">
              {form.description.length}/1000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Price (৳)
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  min="0.01"
                  step="0.01"
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Price must be greater than zero.
              </p>
            </div>

            <div>
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Estimated Duration
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <Clock3 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  min="1"
                  step="1"
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Duration in minutes. Must be a positive whole number.
              </p>
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Service Image
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="rounded-xl border border-dashed border-border bg-background p-4 sm:p-5">

              {imagePreview ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  <div className="relative h-36 w-full overflow-hidden rounded-xl border border-border bg-muted sm:h-32 sm:w-44">
                    <img
                      src={imagePreview}
                      alt="Service preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Image selected
                    </h3>

                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {imageFile?.name}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {(imageFile!.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition-colors hover:text-red-700 disabled:opacity-50 dark:text-red-400"
                    >
                      <X className="h-4 w-4" />
                      Remove Image
                    </button>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-7 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ImagePlus className="h-7 w-7" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    Upload Service Image
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Select an image from your device.
                  </p>

                  <label
                    htmlFor="serviceImage"
                    className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted ${
                      loading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </label>
                </div>
              )}

              <input
                id="serviceImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />

              <p className="mt-4 border-t border-border pt-3 text-center text-xs text-muted-foreground">
                JPG, PNG or WEBP · Maximum file size 5MB · Uploaded via ImgBB
              </p>

            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Service Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <p className="mt-2 text-xs text-muted-foreground">
              New services are active by default and available for booking.
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">

          <Link
            href="/dashboard/admin/services"
            className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Service...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Service
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  );
}
