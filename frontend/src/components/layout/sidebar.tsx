"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  User,
  LogOut,
  Shield,
  FolderOpen,
  ListTodo,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { SiteLogo } from "@/components/layout/site-logo";

const STUDENT_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/my-tasks", label: "My Tasks", icon: CheckSquare },
  { href: "/profile", label: "Profile", icon: User },
];

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Admin Overview", icon: Shield },
  { href: "/admin/subjects", label: "Manage Subjects", icon: BookOpen },
  { href: "/admin/tasks", label: "Manage Tasks", icon: ListTodo },
  { href: "/admin/content", label: "Manage Content", icon: FolderOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isLoggedIn } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const brandHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <aside className="hidden md:flex h-screen sticky top-0 self-start flex-col w-64 overflow-hidden bg-[#17194D] text-white shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <Link
        href={brandHref}
        className="flex items-center border-b border-white/10 px-5 py-5 transition-opacity hover:opacity-90"
      >
        <SiteLogo variant="primary-dark" className="h-12 w-auto" />
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Main Menu */}
        <div className="space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {STUDENT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href) && !pathname.startsWith("/admin"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-[background-color,color,box-shadow] duration-150 ease-out group",
                  isActive
                    ? "bg-[#193DA0] text-white shadow-md shadow-[#193DA0]/20 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-[#FFC329]" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Admin Section (Only shown if user.role === 'ADMIN') */}
        {isAdmin && (
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-[#FFC329] uppercase tracking-wider">
              <span>Administration</span>
              <Shield className="w-3.5 h-3.5" />
            </div>
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-[background-color,color,box-shadow] duration-150 ease-out group",
                    isActive
                      ? "bg-[#193DA0] text-white shadow-md shadow-[#193DA0]/20 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-[#FFC329]" : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#193DA0] flex items-center justify-center font-bold text-sm text-white shrink-0">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName || "Student"}</p>
                {isAdmin && (
                  <span className="text-[9px] font-bold bg-[#FFC329] text-[#17194D] px-1.5 py-0.2 rounded-xs uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
