"use client";

import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/subjects";
import { FilterSubjectsParams, Subject } from "@/types";

export function useSubjects(params?: FilterSubjectsParams) {
  return useQuery<Subject[]>({
    queryKey: ["subjects", params],
    queryFn: () => subjectsApi.getSubjects(params),
  });
}

export function useSubject(id: string) {
  return useQuery<Subject>({
    queryKey: ["subjects", id],
    queryFn: () => subjectsApi.getSubjectById(id),
    enabled: !!id,
  });
}
