"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { useAdminTasks } from "@/hooks/use-admin";
import { useContent } from "@/hooks/use-content";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  BookOpen,
  FolderOpen,
  ListTodo,
  Shield,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const subjectsQuery = useSubjects();
  const tasksQuery = useAdminTasks();
  const contentQuery = useContent();

  if (user?.role !== "ADMIN") {
    return (
      <div className="my-12 mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <Shield className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="mb-1 text-lg font-bold text-red-900">Access Restricted</h2>
        <p className="mb-4 text-sm text-red-700">
          This portal is reserved for system administrators.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Return to Student Dashboard</Button>
        </Link>
      </div>
    );
  }

  const publishedTasks =
    tasksQuery.data?.filter((task) => task.status === "PUBLISHED").length ?? 0;
  const draftTasks =
    tasksQuery.data?.filter((task) => task.status === "DRAFT").length ?? 0;

  const managementSections = [
    {
      href: "/admin/subjects",
      title: "Subjects",
      description: "Create, edit, and archive academic subjects.",
      icon: BookOpen,
      color: "bg-blue-50 text-[#193DA0]",
      query: subjectsQuery,
      count: subjectsQuery.data?.length,
      countLabel: "active subjects",
    },
    {
      href: "/admin/tasks",
      title: "Tasks",
      description: "Create assignments and manage publication status.",
      icon: ListTodo,
      color: "bg-amber-50 text-amber-600",
      query: tasksQuery,
      count: tasksQuery.data?.length,
      countLabel: "total tasks",
      detail: `${publishedTasks} published · ${draftTasks} drafts`,
    },
    {
      href: "/admin/content",
      title: "Study content",
      description: "Upload and organize course materials and resources.",
      icon: FolderOpen,
      color: "bg-emerald-50 text-emerald-600",
      query: contentQuery,
      count: contentQuery.data?.pagination?.total,
      countLabel: "content items",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="border-b border-[#DCE5F5] pb-5 sm:pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#193DA0] text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17194D]">
              Admin overview
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              Manage the platform&apos;s academic resources.
            </p>
          </div>
        </div>
      </header>

      <section aria-label="Administration tools">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#344054]">Management</h2>
          <span className="text-xs text-[#667085]">Signed in as {user.fullName}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {managementSections.map((section) => {
            const Icon = section.icon;

            return (
              <Card
                key={section.href}
                className="flex flex-col p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#193DA0]/30 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${section.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {section.query.isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : section.query.isError ? (
                    <span className="text-right text-xs font-medium text-red-600">
                      Unable to load
                    </span>
                  ) : (
                    <div className="text-right">
                      <p className="text-2xl font-bold leading-none text-[#17194D]">
                        {section.count ?? 0}
                      </p>
                      <p className="mt-1 text-xs text-[#667085]">
                        {section.countLabel}
                      </p>
                    </div>
                  )}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#17194D]">
                  {section.title}
                </h3>
                <p className="mt-1 min-h-10 text-sm leading-5 text-[#667085]">
                  {section.description}
                </p>
                {section.detail && !section.query.isLoading && !section.query.isError && (
                  <p className="mt-3 text-xs font-medium text-[#667085]">
                    {section.detail}
                  </p>
                )}

                <Link href={section.href} className="mt-5">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Manage {section.title.toLowerCase()}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
