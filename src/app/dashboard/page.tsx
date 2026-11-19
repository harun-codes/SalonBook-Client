
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardRouterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in?redirect=%2Fdashboard");
  }

  const role = (session.user as { role?: string }).role;

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "customer") {
    redirect("/dashboard/customer");
  }

  redirect("/");
}
