
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import AdminSidebar from "@/components/dashboard/admin/admin-sidebar";
import AdminDashboardHeader from "@/components/dashboard/admin/admin-dashboard-header";

export default async function AdminDashboardLayout({
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

  if (role !== "admin") {
    if (role === "customer") {
      redirect("/dashboard/customer");
    }

    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="min-h-screen lg:pl-64">
        <AdminDashboardHeader />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
