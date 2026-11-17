
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Browse Services",
    href: "/services",
  },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Scissors className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Salon<span className="text-orange-500">Book</span>
            </span>
            <span className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
              Beauty & Wellness
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <Button variant="ghost"  className="rounded-full px-5">
            <Link href="/sign-in">Sign In</Link>
          </Button>

          <Button  className="rounded-full px-6">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] border-border bg-background px-5"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="text-xl font-bold text-primary">
                  SalonBook
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <SheetClose key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-secondary text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-8 border-t border-border pt-6">
                <div className="grid gap-3">
                  <SheetClose>
                    <Link
                      href="/sign-in"
                      className="flex h-11 items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Sign In
                    </Link>
                  </SheetClose>

                  <SheetClose>
                    <Link
                      href="/sign-up"
                      className="flex h-11 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                    >
                      Get Started
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
