
import AdminSidebar from "@/components/dashboard/admin/admin-sidebar";
import AdminDashboardHeader from "@/components/dashboard/admin/admin-dashboard-header";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
