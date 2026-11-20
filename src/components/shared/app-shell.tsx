
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

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
    </div>
  );
}
