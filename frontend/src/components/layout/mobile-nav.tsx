"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  User,
  LogOut,
  GraduationCap,
  Shield,
  ListTodo,
  FolderOpen,
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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isLoggedIn } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const brandHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <div className="md:hidden flex flex-col bg-[#17194D] border-b border-slate-800 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3.5">
        <Link
          href={brandHref}
          aria-label="DevLearners Hub home"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#193DA0] text-[#FFC329]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-base">DevLearners Hub</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-3 border-t border-white/10 bg-[#17194D] max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            {STUDENT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#193DA0] text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-[#FFC329]" : "text-slate-400")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-white/10">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#FFC329] uppercase tracking-wider">
                Administration
              </div>
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#193DA0] text-white font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-[#FFC329]" : "text-slate-400")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#193DA0] flex items-center justify-center font-bold text-xs text-white">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-xs text-slate-200 font-medium">{user?.fullName || "Student"}</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
