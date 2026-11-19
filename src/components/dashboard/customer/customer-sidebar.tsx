
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    CalendarDays,
    LayoutDashboard,
    Menu,
    Scissors,
    UserRound,
} from "lucide-react";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";


const navItems = [
  {
    name: "Overview",
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    name: "My Appointments",
    href: "/dashboard/customer/appointments",
    icon: CalendarDays,
  },
  {
    name: "My Profile",
    href: "/dashboard/customer/profile",
    icon: UserRound,
  },
];

function SidebarContent({
    pathname,
    mobile = false,
}: {
    pathname: string;
    mobile?: boolean;
}) {
    return (
        <div className="flex h-full flex-col bg-card">
            <div className="flex h-20 items-center gap-3 border-b border-border px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Scissors className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Salon<span className="text-orange-500">Book</span>
                    </h2>
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Customer Portal
                    </p>
                </div>
            </div>

            <div className="px-4 pb-3 pt-7">
                <p className="px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Menu
                </p>
            </div>

            <nav className="flex-1 space-y-2 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    const active =
                        item.href === "/dashboard/customer"
                            ? pathname === "/dashboard/customer"
                            : pathname.startsWith(item.href);

                    const link = (
                        <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active
                                    ? "bg-secondary text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );

                    return mobile ? (
                        <SheetClose key={item.href}>
                            {link}
                        </SheetClose>
                    ) : (
                        <div key={item.href}>{link}</div>
                    );
                })}
            </nav>

            <div className="border-t border-border p-5">
                <p className="text-sm font-semibold text-foreground">
                    SalonBook
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Beauty & Wellness
                </p>
            </div>
        </div>
    );
}

export default function CustomerSidebar() {
    const pathname = usePathname();

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border lg:flex lg:flex-col">
                <SidebarContent pathname={pathname} />
            </aside>

            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger
                        aria-label="Open dashboard navigation"
                        className="fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm"
                    >
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-[280px] border-r border-border bg-card p-0"
                    >
                        <SidebarContent pathname={pathname} mobile />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
