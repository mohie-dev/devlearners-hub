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
  GraduationCap,
  Shield,
  FolderOpen,
  ListTodo,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

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
        aria-label="DevLearners Hub home"
        className="flex items-center gap-3 px-6 py-6 border-b border-white/10 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#193DA0] text-[#FFC329] shadow-inner">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white leading-none">DevLearners</h1>
          <span className="text-xs font-semibold text-[#FFC329] tracking-wider uppercase">Hub</span>
        </div>
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
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
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
                    "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
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
