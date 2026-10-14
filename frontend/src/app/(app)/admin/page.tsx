"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { useAdminTasks } from "@/hooks/use-admin";
import { useContent } from "@/hooks/use-content";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  BookOpen,
  ListTodo,
  FolderOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { data: subjects, isLoading: isSubjectsLoading } = useSubjects();
  const { data: tasks, isLoading: isTasksLoading } = useAdminTasks();
  const { data: contentData, isLoading: isContentLoading } = useContent();

  if (user?.role !== "ADMIN") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
        <Shield className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-900 mb-1">Access Restricted</h2>
        <p className="text-sm text-red-700 mb-4">
          This portal is reserved for system administrators.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Return to Student Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isLoading = isSubjectsLoading || isTasksLoading || isContentLoading;

  const totalSubjects = subjects?.length ?? 0;
  const totalTasks = tasks?.length ?? 0;
  const publishedTasks = tasks?.filter((t) => t.status === "PUBLISHED").length ?? 0;
  const draftTasks = tasks?.filter((t) => t.status === "DRAFT").length ?? 0;
  const totalContent = contentData?.pagination?.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-[#17194D] text-white p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC329]/20 text-[#FFC329] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, Administrator {user.fullName}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Manage course subjects, author coursework tasks, upload learning materials, and monitor academic content lifecycle.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#193DA0]/40 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Active Subjects
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-[#193DA0]">
              <BookOpen className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-[#17194D]">{totalSubjects}</div>
            )}
            <p className="text-xs text-[#667085] mt-1">Available academic courses</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Total Tasks
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ListTodo className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-[#17194D]">
                {totalTasks}{" "}
                <span className="text-xs font-normal text-[#667085]">
                  ({publishedTasks} published, {draftTasks} drafts)
                </span>
              </div>
            )}
            <p className="text-xs text-[#667085] mt-1">Coursework across all subjects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Study Content Items
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FolderOpen className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-[#17194D]">{totalContent}</div>
            )}
            <p className="text-xs text-[#667085] mt-1">Uploaded files & external resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Subjects */}
        <Card className="flex flex-col justify-between hover:border-[#193DA0]/40 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#193DA0] flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle className="text-base text-[#17194D]">Course Subjects</CardTitle>
            <p className="text-xs text-[#667085] mt-1">
              Add new subjects, edit codes and descriptions, or archive completed subjects.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/admin/subjects" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                <span>Manage Subjects</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Manage Tasks */}
        <Card className="flex flex-col justify-between hover:border-[#193DA0]/40 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <ListTodo className="w-5 h-5" />
            </div>
            <CardTitle className="text-base text-[#17194D]">Course Tasks</CardTitle>
            <p className="text-xs text-[#667085] mt-1">
              Create assignments, set deadlines, change status from DRAFT to PUBLISHED, or delete tasks.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/admin/tasks" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                <span>Manage Tasks</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Manage Content */}
        <Card className="flex flex-col justify-between hover:border-[#193DA0]/40 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <FolderOpen className="w-5 h-5" />
            </div>
            <CardTitle className="text-base text-[#17194D]">Study Content</CardTitle>
            <p className="text-xs text-[#667085] mt-1">
              Upload PDF lecture notes, slides, documents, or link YouTube playlists and Google Drive files.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/admin/content" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                <span>Manage Content</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
