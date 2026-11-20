
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppShell } from "@/components/shared/app-shell";
import { Suspense } from "react";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalonBook | Beauty & Wellness",
  description:
    "Discover premium salon services and book your next beauty appointment with SalonBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />

          <Suspense
            fallback={
              <div
                className="flex min-h-screen items-center justify-center bg-background"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>Loading SalonBook...</span>
                </div>
              </div>
            }
          >
            <AppShell>{children}</AppShell>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
