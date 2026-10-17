"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectTagsApi } from "@/lib/api/subject-tags";
import { CreateSubjectTagDto, SubjectTag } from "@/types";

export function useSubjectTags(subjectId: string) {
  return useQuery<SubjectTag[]>({
    queryKey: ["subject-tags", subjectId],
    queryFn: () => subjectTagsApi.getBySubject(subjectId),
    enabled: !!subjectId,
  });
}

export function useSubjectTagMutations() {
  const queryClient = useQueryClient();

  const createTag = useMutation({
    mutationFn: ({ subjectId, dto }: { subjectId: string; dto: CreateSubjectTagDto }) =>
      subjectTagsApi.create(subjectId, dto),
    onSuccess: (_tag, { subjectId }) => {
      queryClient.invalidateQueries({ queryKey: ["subject-tags", subjectId] });
    },
  });

  return {
    createTag: createTag.mutateAsync,
    isCreatingTag: createTag.isPending,
  };
}
