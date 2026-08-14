import Header from "@/app/components/admin/common/header";
import Sidebar from "@/app/components/admin/common/sidebar";
import AuthGuard from "@/app/components/auth/authGuard";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor & Patient Management System",
  description: "Admin Dashboard - Doctor Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-gray-50">
        <AuthGuard>
          <div className="flex h-screen overflow-hidden">
            {/* ========== Sidebar ========== */}
            <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
              <Sidebar />
            </aside>

            {/* ========== Main Content ========== */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Header */}
              <header className="flex-shrink-0 border-b border-gray-200 bg-white">
                <Header />
              </header>

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
