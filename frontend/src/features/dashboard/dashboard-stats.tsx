"use client";

import React from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/use-auth";
import { useMyTasks } from "@/hooks/use-my-tasks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  BookOpen,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export function DashboardStats() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { tasks, isLoading: isTasksLoading } = useMyTasks();

  const isLoading = isProfileLoading || isTasksLoading;

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "PENDING");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  // Calculate upcoming deadlines (Pending tasks with a dueAt in the future or earliest dueAt)
  const tasksWithDeadlines = pendingTasks
    .filter((t) => t.task.dueAt !== null)
    .sort((a, b) => new Date(a.task.dueAt!).getTime() - new Date(b.task.dueAt!).getTime());

  const nextDeadline = tasksWithDeadlines.length > 0 ? tasksWithDeadlines[0] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#17194D] text-white p-5 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          {isLoading ? (
            <div className="space-y-2 py-1">
              <Skeleton className="h-8 w-64 bg-white/20" />
              <Skeleton className="h-4 w-96 bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back, {profile?.fullName || "Student"}!
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Track your active coursework, manage deadlines, and discover new learning tasks
                tailored to your academic path.
              </p>
              {profile && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {profile.department && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-xs font-medium text-white border border-white/10">
                      Dept: {profile.department}
                    </span>
                  )}
                  {profile.studyLevel && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-xs font-medium text-white border border-white/10">
                      Level {profile.studyLevel}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Decorative Golden Accent Circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#193DA0]/40 blur-2xl pointer-events-none" />
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {/* Total Tasks */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Total Tasks
            </CardTitle>
            <div className="p-2 rounded-lg bg-[#193DA0]/10 text-[#193DA0]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-[#17194D]">{totalTasks}</div>
            )}
            <p className="text-xs text-[#667085] mt-1">In your personal learning list</p>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pending
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-amber-700">{pendingTasks.length}</div>
            )}
            <p className="text-xs text-[#667085] mt-1">Tasks requiring completion</p>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Completed
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-emerald-700">{completedTasks.length}</div>
            )}
            <p className="text-xs text-[#667085] mt-1">Finished coursework tasks</p>
          </CardContent>
        </Card>

        {/* Next Deadline */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#193DA0]">
              Next Deadline
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-[#193DA0]">
              <Calendar className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : nextDeadline ? (
              <div>
                <p className="text-xs font-bold text-[#17194D] truncate" title={nextDeadline.task.title}>
                  {nextDeadline.task.title}
                </p>
                <p className="text-xs text-amber-600 font-medium mt-1">
                  {formatDate(nextDeadline.task.dueAt)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-[#667085]">None pending</p>
                <p className="text-xs text-[#667085] mt-1">All clear for now!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action shortcuts & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base text-[#17194D]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/subjects" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5F5] hover:bg-[#F2F5FA] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#193DA0]/10 text-[#193DA0] group-hover:bg-[#193DA0] group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#17194D]">Explore Subjects</p>
                    <p className="text-xs text-[#667085]">Find new tasks to add</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/my-tasks" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5F5] hover:bg-[#F2F5FA] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#17194D]">Manage My Tasks</p>
                    <p className="text-xs text-[#667085]">Update task progress</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Priority Pending Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-[#17194D]">Priority Tasks</CardTitle>
            <Link href="/my-tasks" className="text-xs font-semibold text-[#193DA0] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : pendingTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#667085] mb-3">No pending tasks on your list!</p>
                <Link href="/subjects">
                  <Button variant="outline" size="sm">
                    Browse and Add Tasks
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.slice(0, 4).map((pt) => (
                  <div
                    key={pt.id}
                    className="flex flex-col items-start gap-2 p-3 rounded-xl border border-[#DCE5F5] bg-[#F2F5FA]/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-[#17194D] truncate">{pt.task.title}</p>
                        <p className="text-xs text-[#667085] truncate">
                          {pt.task.subject?.name} • {pt.task.academicContext}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-amber-700 font-medium shrink-0 ml-3">
                      {pt.task.dueAt ? formatDate(pt.task.dueAt) : "No deadline"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
