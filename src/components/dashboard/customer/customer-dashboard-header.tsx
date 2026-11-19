
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import ProfileDropdown from "@/components/shared/profile-dropdown";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function CustomerDashboardHeader() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) return;

      router.replace("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/95 px-4 pl-16 backdrop-blur-xl sm:px-6 sm:pl-16 lg:px-8">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Customer Portal
        </p>

        <h1 className="text-lg font-bold text-foreground">
          Welcome Back{user?.name ? `, ${user.name}` : ""}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {!isPending && user ? (
          <ProfileDropdown
            user={user}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        ) : !isPending ? (
          <Link
            href="/sign-in"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Sign In
          </Link>
        ) : (
          <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
        )}
      </div>
    </header>
  );
}
