"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthSession } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn: isAuth } = useAuthSession();
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/my-tasks") ||
    pathname.startsWith("/profile");

  useEffect(() => {
    if (isProtected && !isAuth) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isProtected, isAuth, pathname, router]);

  if (isProtected && !isAuth) {
    return (
      <div className="min-h-screen bg-[#F2F5FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#667085]">
          <div className="w-8 h-8 border-3 border-[#193DA0] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F5FA] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F5FA] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-[#667085]">
            <div className="w-8 h-8 border-3 border-[#193DA0] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading workspace...</p>
          </div>
        </div>
      }
    >
      <AppLayoutContent>{children}</AppLayoutContent>
    </Suspense>
  );
}
