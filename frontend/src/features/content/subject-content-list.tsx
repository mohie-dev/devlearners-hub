"use client";

import React, { useState } from "react";
import { useSubjectContent } from "@/hooks/use-content";
import { useSubjectTags } from "@/hooks/use-subject-tags";
import { ContentCard } from "./content-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AcademicContext, FilterContentParams, ResourceType } from "@/types";
import { AlertCircle, FolderOpen, Search, X } from "lucide-react";

interface SubjectContentListProps {
  subjectId: string;
}

export function SubjectContentList({ subjectId }: SubjectContentListProps) {
  const [filters, setFilters] = useState<FilterContentParams>({ page: 1, limit: 9 });
  const { data, isLoading, isError, error, refetch } = useSubjectContent(subjectId, filters);
  const {
    data: tags,
    isLoading: isTagsLoading,
    isError: tagsError,
  } = useSubjectTags(subjectId);
  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const currentPage = filters.page ?? 1;
  const hasActiveFilters = Boolean(
    filters.search?.trim() ||
      filters.academicContext ||
      filters.resourceType ||
      filters.tagIds?.length,
  );

  const updateFilters = (updates: Partial<FilterContentParams>, resetPage = true) => {
    setFilters((current) => ({
      ...current,
      ...updates,
      page: resetPage ? 1 : updates.page ?? current.page ?? 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 9 });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#DCE5F5] bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="content-search">Search materials</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
              <Input
                id="content-search"
                className="pl-9"
                placeholder="Search by title or description"
                value={filters.search ?? ""}
                onChange={(event) =>
                  updateFilters({ search: event.target.value || undefined })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content-context-filter">Academic context</Label>
            <select
              id="content-context-filter"
              value={filters.academicContext ?? ""}
              onChange={(event) =>
                updateFilters({
                  academicContext: (event.target.value || undefined) as AcademicContext | undefined,
                })
              }
              className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
            >
              <option value="">All contexts</option>
              <option value="LECTURE">Lecture</option>
              <option value="TUTORIAL">Tutorial</option>
              <option value="GENERAL">General</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content-type-filter">Resource type</Label>
            <select
              id="content-type-filter"
              value={filters.resourceType ?? ""}
              onChange={(event) =>
                updateFilters({
                  resourceType: (event.target.value || undefined) as ResourceType | undefined,
                })
              }
              className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
            >
              <option value="">All resource types</option>
              <option value="PDF">PDF</option>
              <option value="VIDEO">Video</option>
              <option value="DOCUMENT">Document</option>
              <option value="IMAGE">Image</option>
              <option value="LINK">Link</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-[#172033]">Topics / tags</p>
            <div
              id="content-tag-filter"
              className="max-h-28 space-y-1 overflow-y-auto rounded-lg border border-[#DCE5F5] bg-white p-2"
            >
              {tagsError ? (
                <p role="alert" className="text-xs text-red-600">
                  Could not load tags for this subject.
                </p>
              ) : isTagsLoading ? (
                <p className="text-xs text-[#667085]">Loading tags…</p>
              ) : tags?.length ? tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 text-sm text-[#172033]">
                  <input
                    type="checkbox"
                    checked={filters.tagIds?.includes(tag.id) ?? false}
                    onChange={(event) =>
                      updateFilters({
                        tagIds: event.target.checked
                          ? [...(filters.tagIds ?? []), tag.id]
                          : (filters.tagIds ?? []).filter((id) => id !== tag.id),
                      })
                    }
                    className="accent-[#193DA0]"
                  />
                  {tag.name}
                </label>
              )) : (
                <p className="text-xs text-[#667085]">No tags available.</p>
              )}
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-end border-t border-[#DCE5F5]/60 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-[#667085]"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl border border-[#DCE5F5] bg-white p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-red-900 mb-1">Failed to load course materials</h3>
          <p className="text-sm text-red-600 mb-4">
            {(error as Error)?.message || "Could not retrieve study content for this subject."}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#DCE5F5] rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F2F5FA] flex items-center justify-center text-[#667085] mx-auto mb-3">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#17194D] mb-1">
            {hasActiveFilters ? "No matching materials" : "No study materials uploaded"}
          </h3>
          <p className="text-sm text-[#667085]">
            {hasActiveFilters
              ? "Try changing or clearing your filters to see more materials."
              : "There are currently no lectures, notes, or external resources published for this subject."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#667085]" aria-live="polite">
                Page {currentPage} of {pagination.totalPages} · {pagination.total} materials
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ page: currentPage - 1 }, false)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ page: currentPage + 1 }, false)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
