"use client";

import React, { use, useState, Suspense } from "react";
import Link from "next/link";
import { useSubject } from "@/hooks/use-subjects";
import { useAuth } from "@/hooks/use-auth";
import { TasksList } from "@/features/tasks/tasks-list";
import { SubjectContentList } from "@/features/content/subject-content-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle, CheckSquare, FileText, PlusCircle } from "lucide-react";

interface SubjectDetailPageProps {
  params: Promise<{ subjectId: string }>;
}

function SubjectDetailContent({ subjectId }: { subjectId: string }) {
  const { data: subject, isLoading, isError, error } = useSubject(subjectId);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"tasks" | "content">("content");

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/subjects">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-[#667085] hover:text-[#172033]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subjects</span>
          </Button>
        </Link>

        {isAdmin && (
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link href={`/admin/tasks?subjectId=${subjectId}`} className="w-full sm:w-auto">
              <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </Button>
            </Link>
            <Link href={`/admin/content?subjectId=${subjectId}`} className="w-full sm:w-auto">
              <Button size="sm" className="w-full gap-1.5 text-xs">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Upload Content</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Subject Header */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#DCE5F5] p-6 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            {(error as Error)?.message || "Could not load subject information."}
          </p>
        </div>
      ) : subject ? (
        <div className="bg-white rounded-2xl border border-[#DCE5F5] p-6 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="department">{subject.department}</Badge>
            <Badge variant="level">Level {subject.level}</Badge>
            <span className="text-xs font-mono text-[#667085] bg-[#F2F5FA] px-2.5 py-0.5 rounded-full border border-[#DCE5F5]">
              {subject.code}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#17194D] tracking-tight">{subject.name}</h1>

          <p className="mt-2 text-sm text-[#667085] leading-relaxed max-w-3xl">
            {subject.description || "No detailed description provided for this subject."}
          </p>
        </div>
      ) : null}

      {/* Tab Switcher: Tasks vs Study Materials */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-1 border-b border-[#DCE5F5] pb-px sm:flex sm:items-center sm:gap-2">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex min-w-0 w-full items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer sm:w-auto sm:gap-2 sm:px-4 sm:text-sm ${
              activeTab === "content"
                ? "border-[#193DA0] text-[#193DA0]"
                : "border-transparent text-[#667085] hover:text-[#172033]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="sm:hidden">Content</span>
            <span className="hidden sm:inline">Study Materials & Content</span>
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex min-w-0 w-full items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer sm:w-auto sm:gap-2 sm:px-4 sm:text-sm ${
              activeTab === "tasks"
                ? "border-[#193DA0] text-[#193DA0]"
                : "border-transparent text-[#667085] hover:text-[#172033]"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="sm:hidden">Tasks</span>
            <span className="hidden sm:inline">Course Tasks</span>
          </button>
        </div>

        {activeTab === "tasks" ? (
          <TasksList subjectId={subjectId} />
        ) : (
          <SubjectContentList subjectId={subjectId} />
        )}
      </div>
    </div>
  );
}

export default function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      }
    >
      <SubjectDetailContent subjectId={resolvedParams.subjectId} />
    </Suspense>
  );
}
