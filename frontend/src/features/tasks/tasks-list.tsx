"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskResponse } from "@/types";
import { useBrowseTasks } from "@/hooks/use-tasks";
import { useMyTasks } from "@/hooks/use-my-tasks";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { TaskCard } from "./task-card";
import { TaskDetailDialog } from "./task-detail-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckSquare, AlertCircle } from "lucide-react";

interface TasksListProps {
  subjectId: string;
}

export function TasksList({ subjectId }: TasksListProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { success, error } = useToast();

  const { data: tasks, isLoading, isError, error: tasksError, refetch } = useBrowseTasks(subjectId);
  const { tasks: myTasks, addTask } = useMyTasks();

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addingTaskId, setAddingTaskId] = useState<string | null>(null);

  const myTaskIds = new Set(myTasks.map((t) => t.taskId));

  const handleAddTask = async (task: TaskResponse) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/subjects/${subjectId}`)}`);
      return;
    }

    setAddingTaskId(task.id);
    try {
      await addTask(task.id);
      success(`Added "${task.title}" to My Tasks!`);
      if (selectedTask?.id === task.id) {
        setDetailOpen(false);
      }
    } catch (err: unknown) {
      const e = err as Error;
      error(e.message || "Failed to add task to your personal list.");
    } finally {
      setAddingTaskId(null);
    }
  };

  const handleViewDetails = (task: TaskResponse) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl border border-[#DCE5F5] bg-white p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-red-900 mb-1">Failed to load tasks</h3>
          <p className="text-sm text-red-600 mb-4">
            {(tasksError as Error)?.message || "Could not retrieve tasks for this subject."}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && (!tasks || tasks.length === 0) && (
        <div className="bg-white border border-[#DCE5F5] rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F2F5FA] flex items-center justify-center text-[#667085] mx-auto mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#17194D] mb-1">No tasks published</h3>
          <p className="text-sm text-[#667085]">
            There are currently no published tasks available for this subject. Check back later!
          </p>
        </div>
      )}

      {!isLoading && !isError && tasks && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isAlreadyAdded={myTaskIds.has(task.id)}
              isAdding={addingTaskId === task.id}
              onAddTask={handleAddTask}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <TaskDetailDialog
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAddTask={handleAddTask}
        isAdding={addingTaskId === selectedTask?.id}
        isAlreadyAdded={selectedTask ? myTaskIds.has(selectedTask.id) : false}
      />
    </div>
  );
}
