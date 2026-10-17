import { apiClient } from "./client";
import {
  ContentItem,
  CreateContentDto,
  FilterContentParams,
  PaginatedContentResponse,
  UpdateContentDto,
} from "@/types";

export const contentApi = {
  getContent: async (params?: FilterContentParams): Promise<PaginatedContentResponse> => {
    return apiClient<PaginatedContentResponse>("content", {
      params: {
        subjectId: params?.subjectId,
        academicContext: params?.academicContext,
        resourceType: params?.resourceType,
        sourceType: params?.sourceType,
        search: params?.search,
        tagIds: params?.tagIds?.join(","),
        page: params?.page,
        limit: params?.limit,
      },
    });
  },

  getContentById: async (id: string): Promise<ContentItem> => {
    return apiClient<ContentItem>(`content/${id}`);
  },

  createContent: async (dto: CreateContentDto, file?: File): Promise<ContentItem> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    if (dto.description) formData.append("description", dto.description);
    formData.append("academicContext", dto.academicContext);
    formData.append("resourceType", dto.resourceType);
    formData.append("sourceType", dto.sourceType);
    formData.append("subjectId", dto.subjectId);
    if (dto.tagIds?.length) formData.append("tagIds", JSON.stringify(dto.tagIds));
    if (dto.resourceUrl) formData.append("resourceUrl", dto.resourceUrl);
    if (dto.status) formData.append("status", dto.status);

    if (file) {
      formData.append("file", file);
    }

    return apiClient<ContentItem>("content", {
      method: "POST",
      body: formData,
    });
  },

  updateContent: async (id: string, dto: UpdateContentDto): Promise<ContentItem> => {
    return apiClient<ContentItem>(`content/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
  },

  archiveContent: async (id: string): Promise<ContentItem> => {
    return apiClient<ContentItem>(`content/${id}/archive`, {
      method: "PATCH",
    });
  },
};
