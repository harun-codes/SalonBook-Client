
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import CustomerSidebar from "@/components/dashboard/customer/customer-sidebar";
import CustomerDashboardHeader from "@/components/dashboard/customer/customer-dashboard-header";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const role = (
    session.user as typeof session.user & { role?: string }
  ).role?.toLowerCase();

  if (role !== "customer") {
    if (role === "admin") {
      redirect("/dashboard/admin");
    }

    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerSidebar />

      <div className="min-h-screen lg:pl-64">
        <CustomerDashboardHeader />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
