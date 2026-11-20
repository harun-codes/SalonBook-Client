"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ImagePlus,
  Mail,
  User,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload-image";

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");

  const passwordRules = {
    minLength: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only JPG, PNG and WEBP images are allowed.");
      setMessageType("error");
      input.value = "";
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be greater than 0 and less than 5MB.");
      setMessageType("error");
      input.value = "";
      return;
    }

    setProfileFile(file);
    setMessage("");
    setMessageType("");

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage("");
    setProfileFile(null);
    setMessage("");
    setMessageType("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const name = fullName.trim();
    const userEmail = email.trim();

    if (!name || !userEmail || !password) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    if (!isPasswordValid) {
      setMessage(
        "Password must contain at least 6 characters, one uppercase letter, and one lowercase letter."
      );
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      if (profileFile) {
        imageUrl = await uploadImage(profileFile, "signup");
      }


      const { error } = await authClient.signUp.email({
        name,
        email: userEmail,
        password,
        image: imageUrl || undefined,
      });

      if (error) {
        setMessage(error.message || "Registration failed.");
        setMessageType("error");
        return;
      }

      toast.success("Account Created Successfully!", {
        description: "Welcome to SalonBook! Redirecting you to sign in...",
        duration: 4000,
      });

      setTimeout(() => {
        router.push("/sign-in");
        router.refresh();
      }, 1200);

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setMessage("");
    setMessageType("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
      });

      if (error) {
        setMessage(error.message || "Google authentication failed.");
        setMessageType("error");
        setGoogleLoading(false);
      }
    } catch {
      setMessage("Google authentication failed. Please try again.");
      setMessageType("error");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-7">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#032D22] dark:text-[#B7F7D4] sm:text-3xl">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Join SalonBook and book your favorite salon services.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/10 dark:focus:border-[#A7E8C5]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/10 dark:focus:border-[#A7E8C5]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create your password"
                  autoComplete="new-password"
                  required
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/10 dark:focus:border-[#A7E8C5]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || googleLoading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#075E46]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <p
                  className={
                    passwordRules.minLength
                      ? "text-[#075E46] dark:text-[#A7E8C5]"
                      : "text-muted-foreground"
                  }
                >
                  {passwordRules.minLength ? "✓" : "○"} Minimum 6 characters
                </p>

                <p
                  className={
                    passwordRules.uppercase
                      ? "text-[#075E46] dark:text-[#A7E8C5]"
                      : "text-muted-foreground"
                  }
                >
                  {passwordRules.uppercase ? "✓" : "○"} One uppercase letter
                </p>

                <p
                  className={
                    passwordRules.lowercase
                      ? "text-[#075E46] dark:text-[#A7E8C5]"
                      : "text-muted-foreground"
                  }
                >
                  {passwordRules.lowercase ? "✓" : "○"} One lowercase letter
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="profileImage"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Profile Image
              </label>

              {!profileImage ? (
                <label
                  htmlFor="profileImage"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background px-4 py-6 text-center transition hover:border-[#075E46]/50"
                >
                  <ImagePlus className="h-7 w-7 text-[#075E46] dark:text-[#A7E8C5]" />

                  <span className="mt-2 text-xs font-semibold text-foreground">
                    Upload Profile Image
                  </span>

                  <span className="mt-1 text-[11px] text-muted-foreground">
                    PNG, JPG or JPEG up to 5MB
                  </span>

                  <input
                    ref={fileInputRef}
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={loading || googleLoading}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative flex justify-center rounded-lg border border-border bg-background p-4">
                  <img
                    src={profileImage}
                    alt="Profile preview"
                    className="h-24 w-24 rounded-full border-4 border-[#E8FFF2] object-cover dark:border-[#203B2E]"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading || googleLoading}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#075E46] text-white transition hover:bg-[#064B39]"
                    aria-label="Remove profile image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`rounded-lg px-3.5 py-2.5 text-xs font-medium ${messageType === "error"
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-[#E8FFF2] text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]"
                  }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#075E46] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#064B39] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[11px] text-muted-foreground">OR</span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.39Z"
              />

              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0 0 12 21.5Z"
              />

              <path
                fill="#FBBC05"
                d="M6.54 13.62A5.86 5.86 0 0 1 6.23 12c0-.56.11-1.1.31-1.62v-2.5H3.3A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.12l3.24-2.5Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.35c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.45 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.5c.77-2.31 2.92-4.03 5.46-4.03Z"
              />
            </svg>

            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-[#075E46] hover:underline dark:text-[#A7E8C5]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}