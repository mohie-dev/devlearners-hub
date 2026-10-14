import { apiClient } from "./client";
import { CreateTaskDto, TaskResponse, UpdateTaskDto } from "@/types";

export const tasksApi = {
  browseTasks: async (subjectId: string): Promise<TaskResponse[]> => {
    return apiClient<TaskResponse[]>("tasks/browse", {
      params: {
        subjectId,
      },
    });
  },

  getAllTasks: async (): Promise<TaskResponse[]> => {
    return apiClient<TaskResponse[]>("tasks");
  },

  getTaskById: async (id: string): Promise<TaskResponse> => {
    return apiClient<TaskResponse>(`tasks/${id}`);
  },

  createTask: async (dto: CreateTaskDto): Promise<TaskResponse> => {
    return apiClient<TaskResponse>("tasks", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  updateTask: async (id: string, dto: UpdateTaskDto): Promise<TaskResponse> => {
    return apiClient<TaskResponse>(`tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
  },

  deleteTask: async (id: string): Promise<void> => {
    return apiClient<void>(`tasks/${id}`, {
      method: "DELETE",
    });
  },
};
