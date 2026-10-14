"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/subjects";
import { tasksApi } from "@/lib/api/tasks";
import {
  CreateSubjectDto,
  CreateTaskDto,
  TaskResponse,
  UpdateSubjectDto,
  UpdateTaskDto,
} from "@/types";

export function useAdminTasks() {
  return useQuery<TaskResponse[]>({
    queryKey: ["admin-tasks"],
    queryFn: () => tasksApi.getAllTasks(),
  });
}

export function useAdminSubjectMutations() {
  const queryClient = useQueryClient();

  const createSubject = useMutation({
    mutationFn: (dto: CreateSubjectDto) => subjectsApi.createSubject(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  const updateSubject = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubjectDto }) =>
      subjectsApi.updateSubject(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  const archiveSubject = useMutation({
    mutationFn: (id: string) => subjectsApi.archiveSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  return {
    createSubject: createSubject.mutateAsync,
    isCreatingSubject: createSubject.isPending,
    updateSubject: updateSubject.mutateAsync,
    isUpdatingSubject: updateSubject.isPending,
    archiveSubject: archiveSubject.mutateAsync,
    isArchivingSubject: archiveSubject.isPending,
  };
}

export function useAdminTaskMutations() {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: (dto: CreateTaskDto) => tasksApi.createTask(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDto }) =>
      tasksApi.updateTask(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    createTask: createTask.mutateAsync,
    isCreatingTask: createTask.isPending,
    updateTask: updateTask.mutateAsync,
    isUpdatingTask: updateTask.isPending,
    deleteTask: deleteTask.mutateAsync,
    isDeletingTask: deleteTask.isPending,
  };
}
