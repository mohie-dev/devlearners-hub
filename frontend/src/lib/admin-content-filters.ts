import type {
  AcademicContext,
  ContentSourceType,
  FilterContentParams,
  ResourceType,
} from "@/types";

export interface AdminContentFilters {
  search: string;
  subjectId: string;
  academicContext: AcademicContext | "";
  resourceType: ResourceType | "";
  sourceType: ContentSourceType | "";
  tagIds: string[];
}

export const ADMIN_CONTENT_PAGE_SIZE = 20;

export function buildAdminContentParams(
  filters: AdminContentFilters,
  page: number,
): FilterContentParams {
  const search = filters.search.trim();

  return {
    ...(search ? { search } : {}),
    ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
    ...(filters.academicContext ? { academicContext: filters.academicContext } : {}),
    ...(filters.resourceType ? { resourceType: filters.resourceType } : {}),
    ...(filters.sourceType ? { sourceType: filters.sourceType } : {}),
    ...(filters.tagIds.length ? { tagIds: filters.tagIds } : {}),
    page,
    limit: ADMIN_CONTENT_PAGE_SIZE,
  };
}

export function hasActiveAdminContentFilters(filters: AdminContentFilters): boolean {
  return Boolean(
    filters.search.trim() ||
      filters.subjectId ||
      filters.academicContext ||
      filters.resourceType ||
      filters.sourceType ||
      filters.tagIds.length > 0,
  );
}
