
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Scissors,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const getCallbackURL = () => {
    const callbackURL = new URLSearchParams(
      window.location.search
    ).get("callbackURL");

    if (
      callbackURL &&
      callbackURL.startsWith("/") &&
      !callbackURL.startsWith("//") &&
      !callbackURL.includes("\\")
    ) {
      return callbackURL;
    }

    return "/";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Validation Failed", {
        description: "Please enter your email and password.",
      });
      return;
    }

    const callbackURL = getCallbackURL();

    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL,
      });

      if (error) {
        toast.error("Login Failed", {
          description: error.message || "Invalid email or password.",
        });
        return;
      }

      toast.success("Login Successful", {
        description: "Welcome to SalonBook!",
        duration: 5000,
      });

      setTimeout(() => {
        router.replace(callbackURL);
        router.refresh();
      }, 800);
    } catch {
      toast.error("Login Failed", {
        description: "Unable to sign in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: getCallbackURL(),
      });

      if (error) {
        toast.error("Google Login Failed", {
          description:
            error.message ||
            "Google authentication failed. Please try again.",
        });

        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Google Login Failed", {
        description: "Google authentication failed. Please try again.",
      });

      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8FFF2] text-[#075E46] dark:bg-[#203B2E] dark:text-[#A7E8C5]">
              <Scissors className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to SalonBook
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isLoading || isGoogleLoading}
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/10 dark:focus:border-[#A7E8C5]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading || isGoogleLoading}
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-foreground outline-none transition focus:border-[#075E46] focus:ring-2 focus:ring-[#075E46]/10 dark:focus:border-[#A7E8C5]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#075E46] px-4 text-sm font-bold text-white transition hover:bg-[#064C39] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#075E46] dark:hover:bg-[#087456]"
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs font-medium text-muted-foreground">
                OR
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                "Connecting to Google..."
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.92-4.2 2.92-7.42Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.5Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.53 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.1-1.08.3-1.59V7.88H3.29A9.48 9.48 0 0 0 2.25 12c0 1.53.37 2.98 1.04 4.12l3.24-2.53Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.24 2.53C7.3 8.1 9.46 6.38 12 6.38Z"
                    />
                  </svg>

                  Continue with Google
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-bold text-[#075E46] hover:underline dark:text-[#A7E8C5]"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
