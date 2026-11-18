
import CustomerSidebar from "@/components/dashboard/customer-sidebar";
import CustomerDashboardHeader from "@/components/dashboard/customer-dashboard-header";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
