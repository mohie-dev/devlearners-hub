"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TaskProgressStatus } from "@/types";
import { useMyTasks } from "@/hooks/use-my-tasks";
import { useToast } from "@/components/providers/toast-provider";
import { StudentTaskCard } from "./student-task-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, AlertCircle, BookOpen, Clock, CheckCircle } from "lucide-react";

export function MyTasksList() {
  const { tasks, isLoading, isError, error, updateProgress, removeTask, refetch } = useMyTasks();
  const { success, error: toastError } = useToast();
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");

  const pendingTasks = tasks.filter((t) => t.status === "PENDING");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  const filteredTasks = tasks.filter((t) => {
    if (filter === "PENDING") return t.status === "PENDING";
    if (filter === "COMPLETED") return t.status === "COMPLETED";
    return true;
  });

  const handleUpdateStatus = async (taskId: string, newStatus: TaskProgressStatus) => {
    try {
      await updateProgress({ taskId, status: newStatus });
      success(
        newStatus === "COMPLETED"
          ? "Task completed! Great job."
          : "Task status returned to pending."
      );
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to update task progress.");
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      await removeTask(taskId);
      success("Task removed from your personal list.");
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to remove task.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Counter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-[#DCE5F5]">
        <div className="grid w-full grid-cols-3 gap-1 p-1 bg-[#F2F5FA] rounded-lg border border-[#DCE5F5] sm:flex sm:w-auto sm:items-center sm:gap-1.5">
          <button
            onClick={() => setFilter("ALL")}
            className={`min-w-0 px-1.5 py-1.5 rounded-md text-center text-[10px] sm:px-3 sm:text-xs font-medium transition-all ${
              filter === "ALL"
                ? "bg-white text-[#17194D] shadow-xs font-semibold"
                : "text-[#667085] hover:text-[#172033]"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`min-w-0 px-1.5 py-1.5 rounded-md text-[10px] sm:px-3 sm:text-xs font-medium transition-all flex items-center justify-center gap-0.5 sm:gap-1 ${
              filter === "PENDING"
                ? "bg-white text-amber-700 shadow-xs font-semibold"
                : "text-[#667085] hover:text-amber-700"
            }`}
          >
            <Clock className="w-3 h-3 text-amber-500" />
            Pending ({pendingTasks.length})
          </button>
          <button
            onClick={() => setFilter("COMPLETED")}
            className={`min-w-0 px-1.5 py-1.5 rounded-md text-[10px] sm:px-3 sm:text-xs font-medium transition-all flex items-center justify-center gap-0.5 sm:gap-1 ${
              filter === "COMPLETED"
                ? "bg-white text-emerald-700 shadow-xs font-semibold"
                : "text-[#667085] hover:text-emerald-700"
            }`}
          >
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Completed ({completedTasks.length})
          </button>
        </div>

        <Link href="/subjects" className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full gap-1.5 sm:w-auto">
            <BookOpen className="w-4 h-4 text-[#193DA0]" />
            <span>Discover More Tasks</span>
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 rounded-xl border border-[#DCE5F5] bg-white p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-red-900 mb-1">Failed to load personal tasks</h3>
          <p className="text-sm text-red-600 mb-4">
            {(error as Error)?.message || "Could not retrieve your task list from the server."}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && tasks.length === 0 && (
        <div className="bg-white border border-[#DCE5F5] rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#193DA0]/10 text-[#193DA0] flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#17194D] mb-1">Your task list is empty</h3>
          <p className="text-sm text-[#667085] mb-6 leading-relaxed">
            You haven&apos;t added any tasks yet. Browse active subjects and pick tasks to build your personal learning plan.
          </p>
          <Link href="/subjects">
            <Button size="lg" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Browse Subjects & Tasks</span>
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && tasks.length > 0 && filteredTasks.length === 0 && (
        <div className="bg-white border border-[#DCE5F5] rounded-xl p-8 text-center max-w-sm mx-auto">
          <p className="text-sm text-[#667085]">
            No tasks found in the <strong className="text-[#17194D]">{filter.toLowerCase()}</strong> category.
          </p>
        </div>
      )}

      {!isLoading && !isError && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((st) => (
            <StudentTaskCard
              key={st.id}
              studentTask={st}
              onUpdateStatus={handleUpdateStatus}
              onRemoveTask={handleRemoveTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
