import { apiClient } from "./client";
import { CreateSubjectTagDto, SubjectTag } from "@/types";

export const subjectTagsApi = {
  getBySubject: async (subjectId: string): Promise<SubjectTag[]> => {
    return apiClient<SubjectTag[]>(`subjects/${subjectId}/tags`);
  },

  create: async (subjectId: string, dto: CreateSubjectTagDto): Promise<SubjectTag> => {
    return apiClient<SubjectTag>(`subjects/${subjectId}/tags`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};
