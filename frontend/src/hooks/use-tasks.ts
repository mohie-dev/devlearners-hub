"use client";

import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { TaskResponse } from "@/types";

export function useBrowseTasks(subjectId: string) {
  return useQuery<TaskResponse[]>({
    queryKey: ["tasks", "browse", subjectId],
    queryFn: () => tasksApi.browseTasks(subjectId),
    enabled: !!subjectId,
  });
}
