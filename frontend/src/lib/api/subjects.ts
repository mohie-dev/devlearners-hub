import { apiClient } from "./client";
import {
  CreateSubjectDto,
  FilterSubjectsParams,
  Subject,
  UpdateSubjectDto,
} from "@/types";

export const subjectsApi = {
  getSubjects: async (params?: FilterSubjectsParams): Promise<Subject[]> => {
    return apiClient<Subject[]>("subjects", {
      params: {
        level: params?.level,
        department: params?.department,
        search: params?.search,
      },
    });
  },

  getSubjectById: async (id: string): Promise<Subject> => {
    return apiClient<Subject>(`subjects/${id}`);
  },

  createSubject: async (dto: CreateSubjectDto): Promise<Subject> => {
    return apiClient<Subject>("subjects", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  updateSubject: async (id: string, dto: UpdateSubjectDto): Promise<Subject> => {
    return apiClient<Subject>(`subjects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
  },

  archiveSubject: async (id: string): Promise<Subject> => {
    return apiClient<Subject>(`subjects/${id}/archive`, {
      method: "PATCH",
    });
  },
};
