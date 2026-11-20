
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "sonner";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background">
      {!isDashboard && <Navbar />}

      {children}

      {!isDashboard && <Footer />}

      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </div>
  );
}
