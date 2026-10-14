import { apiClient } from "./client";
import { StudentTask, TaskProgressStatus, UserProfile } from "@/types";

export const meApi = {
  getProfile: async (): Promise<UserProfile> => {
    return apiClient<UserProfile>("me");
  },

  getMyTasks: async (): Promise<StudentTask[]> => {
    return apiClient<StudentTask[]>("me/tasks");
  },

  addTask: async (taskId: string): Promise<StudentTask> => {
    return apiClient<StudentTask>("me/tasks", {
      method: "POST",
      body: JSON.stringify({ taskId }),
    });
  },

  updateTaskProgress: async (taskId: string, status: TaskProgressStatus): Promise<StudentTask> => {
    return apiClient<StudentTask>(`me/tasks/${taskId}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  removeTask: async (taskId: string): Promise<void> => {
    return apiClient<void>(`me/tasks/${taskId}`, {
      method: "DELETE",
    });
  },
};
