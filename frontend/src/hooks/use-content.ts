"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "@/lib/api/content";
import { CreateContentDto, FilterContentParams, PaginatedContentResponse, UpdateContentDto } from "@/types";

export function useContent(params?: FilterContentParams) {
  return useQuery<PaginatedContentResponse>({
    queryKey: ["content", params],
    queryFn: () => contentApi.getContent(params),
  });
}

export function useSubjectContent(
  subjectId: string,
  params?: Omit<FilterContentParams, "subjectId">,
) {
  return useQuery<PaginatedContentResponse>({
    queryKey: ["content", "subject", subjectId, params],
    queryFn: () => contentApi.getContent({ ...params, subjectId }),
    enabled: !!subjectId,
  });
}

export function useContentMutations() {
  const queryClient = useQueryClient();

  const createContent = useMutation({
    mutationFn: ({ dto, file }: { dto: CreateContentDto; file?: File }) =>
      contentApi.createContent(dto, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  const updateContent = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateContentDto }) =>
      contentApi.updateContent(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  const archiveContent = useMutation({
    mutationFn: (id: string) => contentApi.archiveContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  return {
    createContent: createContent.mutateAsync,
    isCreating: createContent.isPending,
    updateContent: updateContent.mutateAsync,
    isUpdating: updateContent.isPending,
    archiveContent: archiveContent.mutateAsync,
    isArchiving: archiveContent.isPending,
  };
}
