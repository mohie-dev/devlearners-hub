"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { useSubjectTags } from "@/hooks/use-subject-tags";
import { useContent, useContentMutations } from "@/hooks/use-content";
import { ContentTagSelector } from "@/features/content/content-tag-selector";
import {
  ADMIN_CONTENT_PAGE_SIZE,
  buildAdminContentParams,
  hasActiveAdminContentFilters,
} from "@/lib/admin-content-filters";
import type { AdminContentFilters } from "@/lib/admin-content-filters";
import { useToast } from "@/components/providers/toast-provider";
import {
  AcademicContext,
  ContentSourceType,
  ContentStatus,
  ContentItem,
  ResourceType,
} from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  FileUp,
  FolderOpen,
  Plus,
  Archive,
  ArrowLeft,
  Shield,
  ExternalLink,
  Download,
  Pencil,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

const MAX_CONTENT_FILE_SIZE = 20 * 1024 * 1024;
const CONTENT_FILE_ACCEPT =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.webp";
const UPLOAD_RESOURCE_TYPES: ResourceType[] = ["PDF", "DOCUMENT", "IMAGE"];
const SELECT_CLASS_NAME =
  "h-11 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 text-sm text-[#172033] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]";
const TEXTAREA_CLASS_NAME =
  "w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] transition-colors placeholder:text-[#667085]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]";

function formatFileSize(size: number): string {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getUploadFileError(file: File, resourceType: ResourceType): string | null {
  if (file.size > MAX_CONTENT_FILE_SIZE) {
    return "This file is larger than 20 MB. Choose a smaller file.";
  }

  const allowedMimeTypes: Partial<Record<ResourceType, string[]>> = {
    PDF: ["application/pdf"],
    DOCUMENT: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ],
    IMAGE: ["image/jpeg", "image/png", "image/webp"],
  };

  if (!allowedMimeTypes[resourceType]?.includes(file.type)) {
    return `This file does not match the ${resourceType.toLowerCase()} resource format.`;
  }

  return null;
}

export default function AdminContentPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<AdminContentFilters>({
    search: "",
    subjectId: "",
    academicContext: "",
    resourceType: "",
    sourceType: "",
    tagIds: [],
  });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((current) => ({ ...current, search: searchInput }));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const updateFilter = <K extends keyof AdminContentFilters,>(
    key: K,
    value: AdminContentFilters[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "subjectId" ? { tagIds: [] } : {}),
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      subjectId: "",
      academicContext: "",
      resourceType: "",
      sourceType: "",
      tagIds: [],
    });
    setPage(1);
  };

  const { data: contentData, isLoading, isFetching, refetch } = useContent(
    buildAdminContentParams(filters, page),
  );
  const {
    data: subjects,
    isLoading: areSubjectsLoading,
    isError: subjectsError,
  } = useSubjects();
  const {
    data: filterTags,
    isLoading: isFilterTagsLoading,
    isError: filterTagsError,
  } = useSubjectTags(filters.subjectId);
  const { createContent, updateContent, archiveContent } = useContentMutations();
  const { success, error: toastError } = useToast();
  const activeFilters = hasActiveAdminContentFilters({ ...filters, search: searchInput });
  const totalResources = contentData?.pagination.total ?? 0;
  const totalPages = contentData?.pagination.totalPages ?? 0;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSubjectId, setEditSubjectId] = useState("");
  const [editAcademicContext, setEditAcademicContext] = useState<AcademicContext>("LECTURE");
  const [editResourceUrl, setEditResourceUrl] = useState("");
  const [editStatus, setEditStatus] = useState<ContentStatus>("PUBLISHED");
  const [editTagIds, setEditTagIds] = useState<string[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [academicContext, setAcademicContext] = useState<AcademicContext>("LECTURE");
  const [resourceType, setResourceType] = useState<ResourceType>("PDF");
  const [sourceType, setSourceType] = useState<ContentSourceType>("UPLOAD");
  const [resourceUrl, setResourceUrl] = useState("");
  const [status, setStatus] = useState<ContentStatus>("PUBLISHED");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filePickerSectionRef = useRef<HTMLDivElement>(null);

  if (user?.role !== "ADMIN") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
        <Shield className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-900 mb-1">Access Restricted</h2>
        <p className="text-sm text-red-700 mb-4">Admin privileges required.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const openCreateDialog = () => {
    setTitle("");
    setDescription("");
    setSubjectId(subjects && subjects.length > 0 ? subjects[0].id : "");
    setAcademicContext("LECTURE");
    setResourceType("PDF");
    setSourceType("UPLOAD");
    setResourceUrl("");
    setStatus("PUBLISHED");
    setTagIds([]);
    setFile(null);
    setFileError("");
    setIsCreateOpen(true);
  };

  const openEditDialog = (item: ContentItem) => {
    setEditingContent(item);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditSubjectId(item.subject?.id ?? "");
    setEditAcademicContext(item.academicContext);
    setEditResourceUrl(item.sourceType === "EXTERNAL_LINK" ? item.resourceUrl ?? "" : "");
    setEditStatus(item.status);
    setEditTagIds(item.tags?.map((tag) => tag.id) ?? []);
    setIsEditOpen(true);
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) {
      toastError("Title and subject are required.");
      return;
    }

    if (fileError) {
      filePickerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (sourceType === "UPLOAD" && !file) {
      setFileError("Choose a file to upload before continuing.");
      filePickerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (sourceType === "EXTERNAL_LINK" && !resourceUrl.trim()) {
      toastError("Please provide an external resource URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContent({
        dto: {
          title: title.trim(),
          description: description.trim() || undefined,
          academicContext,
          resourceType,
          sourceType,
          subjectId,
          tagIds,
          resourceUrl: sourceType === "EXTERNAL_LINK" ? resourceUrl.trim() : undefined,
          status,
        },
        file: sourceType === "UPLOAD" && file ? file : undefined,
      });

      success(
        status === "PUBLISHED"
          ? `Resource "${title}" published and ready for students.`
          : `Resource "${title}" saved as a draft.`,
      );
      setIsCreateOpen(false);
      refetch();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to add study content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    if (!editTitle.trim() || !editSubjectId) {
      toastError("Title and subject are required.");
      return;
    }

    if (editingContent.sourceType === "EXTERNAL_LINK" && !editResourceUrl.trim()) {
      toastError("Please provide an external resource URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateContent({
        id: editingContent.id,
        dto: {
          title: editTitle.trim(),
          description: editDescription.trim() || null,
          subjectId: editSubjectId,
          tagIds: editTagIds,
          academicContext: editAcademicContext,
          resourceUrl:
            editingContent.sourceType === "EXTERNAL_LINK" ? editResourceUrl.trim() : undefined,
          status: editStatus,
        },
      });

      success(`Resource "${editTitle}" updated.`);
      setIsEditOpen(false);
      setEditingContent(null);
      refetch();
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to update study content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveContent = async (id: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to archive "${itemTitle}"?`)) return;
    try {
      await archiveContent(id);
      success(`Resource "${itemTitle}" archived.`);
      refetch();
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to archive content.");
    }
  };

  const items = contentData?.items ?? [];
  const firstResource = totalResources === 0 ? 0 : (page - 1) * ADMIN_CONTENT_PAGE_SIZE + 1;
  const lastResource = Math.min(page * ADMIN_CONTENT_PAGE_SIZE, totalResources);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 mb-1 text-[#667085]">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Hub</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#17194D]">Manage Study Content</h1>
          <p className="text-sm text-[#667085]">Upload lecture materials, notes, and academic resources</p>
        </div>

        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Upload Content</span>
        </Button>
      </div>

      {/* Content Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base text-[#17194D]">Published Resources</CardTitle>
          <span className="text-xs font-medium text-[#667085]">
            {totalResources} {totalResources === 1 ? "resource" : "resources"}
          </span>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#DCE5F5] bg-[#F7F9FE] p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-6">
            <div className="space-y-1.5 sm:col-span-2 xl:col-span-2">
              <Label htmlFor="content-search" className="text-xs text-[#667085]">Search resources</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                <Input
                  id="content-search"
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Title or description"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="filter-content-subject" className="text-xs text-[#667085]">Subject</Label>
              <select
                id="filter-content-subject"
                value={filters.subjectId}
                onChange={(event) => updateFilter("subjectId", event.target.value)}
                className="h-11 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
              >
                <option value="">All subjects</option>
                {subjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.code} · {subject.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="filter-content-context" className="text-xs text-[#667085]">Academic context</Label>
              <select
                id="filter-content-context"
                value={filters.academicContext}
                onChange={(event) => updateFilter("academicContext", event.target.value as AdminContentFilters["academicContext"])}
                className="h-11 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
              >
                <option value="">All contexts</option>
                <option value="LECTURE">Lecture</option>
                <option value="TUTORIAL">Tutorial</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="filter-content-type" className="text-xs text-[#667085]">Resource type</Label>
              <select
                id="filter-content-type"
                value={filters.resourceType}
                onChange={(event) => updateFilter("resourceType", event.target.value as AdminContentFilters["resourceType"])}
                className="h-11 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
              >
                <option value="">All types</option>
                <option value="PDF">PDF</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
                <option value="IMAGE">Image</option>
                <option value="LINK">Link</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="filter-content-source" className="text-xs text-[#667085]">Source</Label>
              <select
                id="filter-content-source"
                value={filters.sourceType}
                onChange={(event) => updateFilter("sourceType", event.target.value as AdminContentFilters["sourceType"])}
                className="h-11 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
              >
                <option value="">Any source</option>
                <option value="UPLOAD">Uploaded file</option>
                <option value="EXTERNAL_LINK">External link</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[#667085]">
                Topics / tags
              </p>
              <div
                id="filter-content-tags"
                className="max-h-24 space-y-1 overflow-y-auto rounded-lg border border-[#DCE5F5] bg-white p-2"
              >
                {!filters.subjectId ? (
                  <p className="text-xs text-[#667085]">Select a subject first.</p>
                ) : filterTagsError ? (
                  <p role="alert" className="text-xs text-red-600">
                    Could not load tags for this subject.
                  </p>
                ) : isFilterTagsLoading ? (
                  <p className="text-xs text-[#667085]">Loading tags…</p>
                ) : filterTags?.length ? (
                  filterTags.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-2 text-xs text-[#172033]">
                      <input
                        type="checkbox"
                        checked={filters.tagIds.includes(tag.id)}
                        onChange={(event) =>
                          updateFilter(
                            "tagIds",
                            event.target.checked
                              ? [...filters.tagIds, tag.id]
                              : filters.tagIds.filter((id) => id !== tag.id),
                          )
                        }
                        className="accent-[#193DA0]"
                      />
                      {tag.name}
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-[#667085]">No tags for this subject.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm text-[#667085]" role="status" aria-live="polite">
                Showing {firstResource}–{lastResource} of {totalResources} resources
              </p>
              {isFetching && !isLoading && <span className="text-xs text-[#667085]">Updating…</span>}
            </div>
            {activeFilters && (
              <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset filters
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center">
              <FolderOpen className="mx-auto mb-2 h-8 w-8 text-[#667085]" />
              <p className="text-sm text-[#667085]">
                {activeFilters ? "No published resources match these filters." : "No published resources available yet."}
              </p>
              {activeFilters && (
                <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3 lg:hidden">
                {items.map((item) => (
                  <article key={item.id} className="rounded-xl border border-[#DCE5F5] bg-white p-4 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-[#17194D]">{item.title}</h3>
                        <p className="mt-1 text-xs font-medium text-[#193DA0]">
                          {item.subject?.name || "Subject"}
                        </p>
                      </div>
                      <Badge variant="department">{item.resourceType}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="outline">{item.academicContext}</Badge>
                      <Badge variant="outline">
                        {item.sourceType === "UPLOAD" ? "Cloud File" : "External Link"}
                      </Badge>
                      {item.tags?.map((tag) => (
                        <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                      ))}
                    </div>
                    {item.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#667085]">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {item.resourceUrl ? (
                        <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" className="block">
                          <Button variant="outline" size="sm" className="w-full">
                            {item.sourceType === "UPLOAD" ? (
                              <Download className="h-4 w-4" />
                            ) : (
                              <ExternalLink className="h-4 w-4" />
                            )}
                            View
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Not available
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)} className="w-full">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleArchiveContent(item.id, item.title)}
                        className="col-span-2 w-full"
                      >
                        <Archive className="h-4 w-4" />
                        Archive
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DCE5F5] text-xs font-semibold text-[#667085] uppercase">
                    <th className="pb-3 px-2">Resource Title</th>
                    <th className="pb-3 px-2">Subject</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2">Source</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F5]/60">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F2F5FA]/50 transition-colors">
                      <td className="py-3 px-2">
                        <p className="font-semibold text-[#17194D]">{item.title}</p>
                        <p className="text-xs text-[#667085] line-clamp-1">{item.description || "No description"}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 font-medium text-xs text-[#193DA0]">
                        {item.subject?.name || "Subject"}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="department">{item.resourceType}</Badge>
                      </td>
                      <td className="py-3 px-2 text-xs text-[#667085]">
                        {item.sourceType === "UPLOAD" ? "Cloud File" : "External Link"}
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        {item.resourceUrl && (
                          <a
                            href={item.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              {item.sourceType === "UPLOAD" ? (
                                <Download className="w-3.5 h-3.5 mr-1" />
                              ) : (
                                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                              )}
                              View
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                          className="h-8 px-2 text-xs"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleArchiveContent(item.id, item.title)}
                          className="h-8 px-2 text-xs"
                        >
                          <Archive className="w-3.5 h-3.5 mr-1" />
                          Archive
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {totalPages > 1 && (
                <div className="flex flex-col gap-3 border-t border-[#DCE5F5] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-[#667085]">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1 || isFetching}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages || isFetching}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal: Create Content */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        className="h-[min(90dvh,900px)] max-w-2xl"
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#193DA0]">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle>Add study material</DialogTitle>
              <p className="mt-1 text-xs text-[#667085]">
                Share a course resource with students.
              </p>
            </div>
          </div>
          <DialogClose onClose={() => setIsCreateOpen(false)} />
        </DialogHeader>

        <form onSubmit={handleSaveContent} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DialogContent className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <div className="space-y-1.5">
              <Label htmlFor="content-title">
                Resource title <span className="text-red-600">*</span>
              </Label>
              <Input
                id="content-title"
                placeholder="e.g. Week 1 lecture notes"
                minLength={2}
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-xs text-[#667085]">Use a short, clear title students can search for.</p>
            </div>

            <section className="space-y-3 rounded-xl border border-[#E6EBF5] bg-[#FAFBFE] p-4">
              <div>
                <h4 className="text-sm font-semibold text-[#17194D]">Course details</h4>
                <p className="mt-1 text-xs text-[#667085]">Choose where this resource belongs.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="content-sub">
                    Subject <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="content-sub"
                    value={subjectId}
                    onChange={(e) => {
                      setSubjectId(e.target.value);
                      setTagIds([]);
                    }}
                    className={SELECT_CLASS_NAME}
                    required
                  >
                    <option value="">
                      {areSubjectsLoading
                        ? "Loading subjects…"
                        : subjectsError
                          ? "Subjects could not be loaded"
                          : "Select a subject"}
                    </option>
                    {subjects?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                  {subjectsError && (
                    <p role="alert" className="text-xs text-red-600">
                      Could not load subjects. Refresh the page and try again.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="content-context">Academic context</Label>
                  <select
                    id="content-context"
                    value={academicContext}
                    onChange={(e) => setAcademicContext(e.target.value as AcademicContext)}
                    className={SELECT_CLASS_NAME}
                  >
                    <option value="LECTURE">Lecture</option>
                    <option value="TUTORIAL">Tutorial</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              </div>

              <ContentTagSelector
                subjectId={subjectId}
                selectedTagIds={tagIds}
                onChange={setTagIds}
              />
            </section>

            <section className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-[#17194D]">Resource</h4>
                <p className="mt-1 text-xs text-[#667085]">Upload a file or share a link.</p>
              </div>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-[#17194D]">
                  How will you add it? <span className="text-red-600">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    aria-pressed={sourceType === "UPLOAD"}
                    onClick={() => {
                      setSourceType("UPLOAD");
                      const nextResourceType = UPLOAD_RESOURCE_TYPES.includes(resourceType)
                        ? resourceType
                        : "PDF";
                      setResourceType(nextResourceType);
                      setFileError(file ? getUploadFileError(file, nextResourceType) ?? "" : "");
                    }}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0] ${
                      sourceType === "UPLOAD"
                        ? "border-[#193DA0] bg-[#F2F5FF] ring-1 ring-[#193DA0]"
                        : "border-[#DCE5F5] bg-white hover:border-[#98A9D3]"
                    }`}
                  >
                    <FileUp className="mt-0.5 h-5 w-5 shrink-0 text-[#193DA0]" />
                    <span>
                      <span className="block text-sm font-semibold text-[#172033]">Upload a file</span>
                      <span className="mt-0.5 block text-xs text-[#667085]">PDF, document, or image · up to 20 MB</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={sourceType === "EXTERNAL_LINK"}
                    onClick={() => {
                      setSourceType("EXTERNAL_LINK");
                      setFile(null);
                      setFileError("");
                    }}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0] ${
                      sourceType === "EXTERNAL_LINK"
                        ? "border-[#193DA0] bg-[#F2F5FF] ring-1 ring-[#193DA0]"
                        : "border-[#DCE5F5] bg-white hover:border-[#98A9D3]"
                    }`}
                  >
                    <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-[#193DA0]" />
                    <span>
                      <span className="block text-sm font-semibold text-[#172033]">Add an external link</span>
                      <span className="mt-0.5 block text-xs text-[#667085]">YouTube, Drive, or another website</span>
                    </span>
                  </button>
                </div>
              </fieldset>

              <div className="space-y-1.5">
                <Label htmlFor="content-rtype">
                  Resource format <span className="text-red-600">*</span>
                </Label>
                <select
                  id="content-rtype"
                  value={resourceType}
                  onChange={(e) => {
                    const nextType = e.target.value as ResourceType;
                    setResourceType(nextType);
                    if (file) setFileError(getUploadFileError(file, nextType) ?? "");
                  }}
                  className={SELECT_CLASS_NAME}
                >
                  {sourceType === "UPLOAD" ? (
                    <>
                      <option value="PDF">PDF document</option>
                      <option value="DOCUMENT">Word, PowerPoint, Excel, or text</option>
                      <option value="IMAGE">Image</option>
                    </>
                  ) : (
                    <>
                      <option value="PDF">PDF</option>
                      <option value="DOCUMENT">Document</option>
                      <option value="VIDEO">Video</option>
                      <option value="IMAGE">Image</option>
                      <option value="LINK">Web link</option>
                      <option value="OTHER">Other</option>
                    </>
                  )}
                </select>
                {sourceType === "UPLOAD" && (
                  <p className="text-xs text-[#667085]">
                    Choose the format that matches your file. Accepted: PDF, Office documents, text, JPG, PNG, or WebP.
                  </p>
                )}
              </div>

            {sourceType === "UPLOAD" ? (
              <div ref={filePickerSectionRef} className="space-y-2 rounded-xl">
                <Label htmlFor="content-file">
                  Choose a file <span className="text-red-600">*</span>
                </Label>
                <div
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    file
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-2 border-dashed border-[#C9D4EA] bg-[#FAFBFE] hover:border-[#193DA0] hover:bg-[#F5F7FF]"
                  }`}
                >
                  <label
                    htmlFor="content-file"
                    className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[#193DA0] ${
                      file ? "flex-1" : "w-full flex-col justify-center px-4 py-5 text-center"
                    }`}
                  >
                    <input
                      id="content-file"
                      type="file"
                      accept={CONTENT_FILE_ACCEPT}
                      className="sr-only"
                      aria-required="true"
                      onChange={(event) => {
                        const selectedFile = event.target.files?.[0];
                        if (!selectedFile) return;
                        const errorMessage = getUploadFileError(selectedFile, resourceType);
                        setFileError(errorMessage ?? "");
                        setFile(errorMessage ? null : selectedFile);
                        event.target.value = "";
                      }}
                      aria-describedby={fileError ? "content-file-error" : "content-file-help"}
                    />
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        file ? "bg-white text-emerald-700" : "rounded-full bg-[#EEF2FF] text-[#193DA0]"
                      }`}
                    >
                      {file ? <FileText className="h-5 w-5" /> : <FileUp className="h-5 w-5" />}
                    </span>
                    <span className={`min-w-0 ${file ? "flex-1" : ""}`}>
                      <span className={`block ${file ? "truncate text-sm font-semibold text-[#172033]" : "text-sm font-semibold text-[#193DA0]"}`}>
                        {file ? file.name : "Choose a file to upload"}
                      </span>
                      <span
                        id="content-file-help"
                        className="mt-1 block text-xs text-[#667085]"
                      >
                        {file
                          ? `${formatFileSize(file.size)} · Ready to upload · Click to replace`
                          : "PDF, Word, PowerPoint, Excel, text, JPG, PNG, or WebP · maximum 20 MB"}
                      </span>
                    </span>
                  </label>
                  {file && (
                    <button
                      type="button"
                      aria-label="Remove selected file"
                      onClick={() => {
                        setFile(null);
                        setFileError("");
                      }}
                      className="rounded-lg p-2 text-[#667085] hover:bg-white hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {fileError && (
                  <p id="content-file-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {fileError}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="content-url">
                  Resource URL <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="content-url"
                  type="url"
                  placeholder="https://"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-[#667085]">Paste a link students can open to access this resource.</p>
              </div>
            )}
            </section>

            <div className="space-y-1.5">
              <Label htmlFor="content-desc">
                Description{" "}
                <span className="text-xs font-normal text-[#667085]">(optional)</span>
              </Label>
              <textarea
                id="content-desc"
                rows={4}
                maxLength={5000}
                placeholder="What does this resource cover? Add a short summary to help students find the right material."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={TEXTAREA_CLASS_NAME}
              />
              <p className="text-right text-xs text-[#667085]">{description.length}/5000</p>
            </div>

            <section className="space-y-2 rounded-xl border border-[#E6EBF5] p-4">
              <Label htmlFor="content-status">Availability</Label>
              <select
                id="content-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className={SELECT_CLASS_NAME}
              >
                <option value="PUBLISHED">Publish now — visible to students immediately</option>
                <option value="DRAFT">Save as draft — not visible to students</option>
              </select>
              <p className="flex items-start gap-2 text-xs text-[#667085]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#193DA0]" />
                {status === "PUBLISHED"
                  ? "Students will be able to find and open this material as soon as you save it."
                  : "Students won't see this material until it is published."}
              </p>
            </section>
          </DialogContent>

          <DialogFooter className="shrink-0 flex-col-reverse border-t bg-white sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#667085]">
              <span className="text-red-600">*</span> Required fields
            </p>
            <div className="flex w-full justify-end gap-2 sm:w-auto">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="gap-2">
                <FileUp className="h-4 w-4" />
                {status === "DRAFT" ? "Save draft" : "Publish resource"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Modal: Edit Content */}
      <Dialog
        open={isEditOpen}
        className="h-[min(84dvh,760px)] max-w-2xl"
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditingContent(null);
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#193DA0]">
              <Pencil className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle>Edit study material</DialogTitle>
              <p className="mt-1 text-xs text-[#667085]">
                Update the details students see.
              </p>
            </div>
          </div>
          <DialogClose onClose={() => setIsEditOpen(false)} />
        </DialogHeader>

        <form onSubmit={handleUpdateContent} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DialogContent className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <div className="space-y-1.5">
              <Label htmlFor="edit-content-title">Resource Title</Label>
              <Input
                id="edit-content-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-content-subject">Subject</Label>
                <select
                  id="edit-content-subject"
                  value={editSubjectId}
                  onChange={(e) => {
                    setEditSubjectId(e.target.value);
                    setEditTagIds([]);
                  }}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                  required
                >
                  <option value="">
                    {areSubjectsLoading
                      ? "Loading subjects…"
                      : subjectsError
                        ? "Subjects could not be loaded"
                        : "Select a subject"}
                  </option>
                  {subjects?.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
                {subjectsError && (
                  <p role="alert" className="text-xs text-red-600">
                    Could not load subjects. Refresh the page and try again.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-content-context">Academic Context</Label>
                <select
                  id="edit-content-context"
                  value={editAcademicContext}
                  onChange={(e) => setEditAcademicContext(e.target.value as AcademicContext)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value="LECTURE">Lecture</option>
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>
            </div>

            <ContentTagSelector
              subjectId={editSubjectId}
              selectedTagIds={editTagIds}
              onChange={setEditTagIds}
            />

            {editingContent?.sourceType === "EXTERNAL_LINK" && (
              <div className="space-y-1.5">
                <Label htmlFor="edit-content-url">
                  External resource URL <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="edit-content-url"
                  type="url"
                  value={editResourceUrl}
                  onChange={(e) => setEditResourceUrl(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="edit-content-status">Availability</Label>
              <select
                id="edit-content-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as ContentStatus)}
                className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
              >
                <option value="PUBLISHED">Publish now — visible to students immediately</option>
                <option value="DRAFT">Save as draft — not visible to students</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-content-description">
                Description <span className="text-xs font-normal text-[#667085]">(optional)</span>
              </Label>
              <textarea
                id="edit-content-description"
                rows={4}
                maxLength={5000}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className={TEXTAREA_CLASS_NAME}
              />
              <p className="text-right text-xs text-[#667085]">{editDescription.length}/5000</p>
            </div>
          </DialogContent>

          <DialogFooter className="shrink-0 flex-col-reverse border-t bg-white sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#667085]">
              <span className="text-red-600">*</span> Required fields
            </p>
            <div className="flex w-full justify-end gap-2 sm:w-auto">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
