
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  User,
  Mail,
  Phone,
  Camera,
  Upload,
  X,
  Save,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload-image";

interface Profile {
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface ProfileResponse {
  success: boolean;
  user?: Partial<Profile>;
  message?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(
      error?.message || "Authentication required. Please sign in."
    );
  }

  return data.token;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileLoaded, setProfileLoaded] = useState(false);

  const fetchProfile = useCallback(async (showSuccessToast = false) => {
    try {
      setLoading(true);
      setProfileLoaded(false);

      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result: ProfileResponse = await response.json();

      if (!response.ok || !result.success || !result.user) {
        throw new Error(
          result.message || "Failed to load profile."
        );
      }

      setProfile({
        name: result.user.name || "",
        email: result.user.email || "",
        phone: result.user.phone || "",
        image: result.user.image || "",
      });

      setProfileLoaded(true);

      if (showSuccessToast) {
        toast.success("Profile Refreshed", {
          description: "Your profile information has been loaded successfully.",
        });
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      toast.error("Unable to Load Profile", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid Image Format", {
        description: "Please select a JPG, PNG or WEBP image.",
      });

      input.value = "";
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      toast.error("Invalid Image Size", {
        description: "Image size must be greater than 0 and less than 5MB.",
      });

      input.value = "";
      return;
    }

    try {
      setUploading(true);

      const uploadedUrl = await uploadImage(file, "profile");

      const imageUrl = new URL(uploadedUrl);

      if (
        imageUrl.protocol !== "https:" ||
        imageUrl.username ||
        imageUrl.password
      ) {
        throw new Error("Invalid uploaded image URL.");
      }

      setProfile((prev) => ({
        ...prev,
        image: uploadedUrl,
      }));

      toast.success("Image Uploaded Successfully", {
        description: "Save changes to update your profile photo.",
      });
    } catch (err) {
      toast.error("Image Upload Failed", {
        description:
          err instanceof Error
            ? err.message
            : "Failed to upload image.",
      });
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const handleRemoveImage = () => {
    setProfile((prev) => ({
      ...prev,
      image: "",
    }));

    toast.info("Profile Image Removed", {
      description: "Save changes to confirm this update.",
    });
  };

  const handleSave = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = profile.name.trim();
    const trimmedPhone = profile.phone.trim();

    if (trimmedName.length < 2 || trimmedName.length > 60) {
      toast.error("Invalid Name", {
        description: "Name must contain 2-60 characters.",
      });
      return;
    }

    if (
      trimmedPhone &&
      !/^[+()\d\s-]{7,20}$/.test(trimmedPhone)
    ) {
      toast.error("Invalid Phone Number", {
        description: "Please enter a valid phone number.",
      });
      return;
    }

    try {
      setSaving(true);

      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          image: profile.image,
        }),
      });

      const result: ProfileResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update profile."
        );
      }

      const updatedProfile: Profile = {
        name: result.user?.name ?? trimmedName,
        email: result.user?.email ?? profile.email,
        phone: result.user?.phone ?? trimmedPhone,
        image: result.user?.image ?? profile.image,
      };

      setProfile(updatedProfile);

      try {
        const { error: authError } = await authClient.updateUser({
          name: updatedProfile.name,
          image: updatedProfile.image || null,
        });

        if (authError) {
          console.error(
            "Auth profile synchronization error:",
            authError
          );
        }
      } catch (syncError) {
        console.error(
          "Auth synchronization failed:",
          syncError
        );
      }

      window.dispatchEvent(
        new CustomEvent("salonbook:profile-updated", {
          detail: {
            name: updatedProfile.name,
            image: updatedProfile.image,
          },
        })
      );

      router.refresh();

      toast.success("Profile Updated Successfully", {
        description: "Your personal information has been updated successfully.",
      });
    } catch (err) {
      toast.error("Profile Update Failed", {
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Manage your personal information and profile settings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchProfile(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading your profile...
            </p>
          </div>
        </div>
      ) : !profileLoaded ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />

          <h2 className="font-bold text-foreground">
            Unable to load profile
          </h2>

          <p className="text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>

          <button
            type="button"
            onClick={() => fetchProfile(true)}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
        >

          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your personal details below.
            </p>
          </div>

          <div className="space-y-6">

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  minLength={2}
                  maxLength={60}
                  required
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-input bg-muted pl-12 pr-4 text-sm text-muted-foreground outline-none"
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Your registered email address cannot be changed here.
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-7 w-7 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">
                      Profile Photo
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG or WEBP. Maximum 5MB.
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {uploading
                        ? "Uploading image..."
                        : "Choose a photo for your account."}
                    </p>
                  </div>

                </div>

                <div className="flex shrink-0 items-center gap-2">

                  {profile.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={saving || uploading}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || saving}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : profile.image ? (
                      <Camera className="h-4 w-4" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploading
                      ? "Uploading..."
                      : profile.image
                        ? "Change Photo"
                        : "Upload Photo"}
                  </button>

                </div>

              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  maxLength={25}
                  placeholder="+8801XXXXXXXXX"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => fetchProfile(true)}
              disabled={saving || uploading}
              className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              Reset Changes
            </button>

            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>

          </div>

        </form>
      )}

    </div>
  );
}
