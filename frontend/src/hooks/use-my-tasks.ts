"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { meApi } from "@/lib/api/me";
import { useAuthSession } from "@/hooks/use-auth";
import { StudentTask, TaskProgressStatus } from "@/types";

export function useMyTasks() {
  const queryClient = useQueryClient();
  const { isLoggedIn: isAuth } = useAuthSession();

  const tasksQuery = useQuery<StudentTask[]>({
    queryKey: ["my-tasks"],
    queryFn: () => meApi.getMyTasks(),
    enabled: isAuth,
  });

  const addTaskMutation = useMutation({
    mutationFn: (taskId: string) => meApi.addTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskProgressStatus }) =>
      meApi.updateTaskProgress(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: (taskId: string) => meApi.removeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    addTask: addTaskMutation.mutateAsync,
    isAdding: addTaskMutation.isPending,
    updateProgress: updateProgressMutation.mutateAsync,
    isUpdating: updateProgressMutation.isPending,
    removeTask: removeTaskMutation.mutateAsync,
    isRemoving: removeTaskMutation.isPending,
  };
}
