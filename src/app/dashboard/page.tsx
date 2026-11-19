
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const role = (
    session.user as typeof session.user & {
      role?: string;
    }
  ).role?.toLowerCase();

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "customer") {
    redirect("/dashboard/customer");
  }

  redirect("/sign-in");
}
