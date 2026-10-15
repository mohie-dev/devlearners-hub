"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { useContent, useContentMutations } from "@/hooks/use-content";
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
import { FolderOpen, Plus, Archive, ArrowLeft, Shield, ExternalLink, Download, Pencil, RotateCcw, Search } from "lucide-react";

export default function AdminContentPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<AdminContentFilters>({
    search: "",
    subjectId: "",
    academicContext: "",
    resourceType: "",
    sourceType: "",
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
    setFilters((current) => ({ ...current, [key]: value }));
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
    });
    setPage(1);
  };

  const { data: contentData, isLoading, isFetching, refetch } = useContent(
    buildAdminContentParams(filters, page),
  );
  const { data: subjects } = useSubjects();
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

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [academicContext, setAcademicContext] = useState<AcademicContext>("LECTURE");
  const [resourceType, setResourceType] = useState<ResourceType>("PDF");
  const [sourceType, setSourceType] = useState<ContentSourceType>("UPLOAD");
  const [resourceUrl, setResourceUrl] = useState("");
  const [status, setStatus] = useState<ContentStatus>("PUBLISHED");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFile(null);
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
    setIsEditOpen(true);
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) {
      toastError("Title and subject are required.");
      return;
    }

    if (sourceType === "UPLOAD" && !file) {
      toastError("Please select a file to upload.");
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
          resourceUrl: sourceType === "EXTERNAL_LINK" ? resourceUrl.trim() : undefined,
          status,
        },
        file: sourceType === "UPLOAD" && file ? file : undefined,
      });

      success(`Resource "${title}" uploaded and published!`);
      setIsCreateOpen(false);
      refetch();
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to add study content.");
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
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader>
          <DialogTitle>Upload / Add Study Material</DialogTitle>
          <DialogClose onClose={() => setIsCreateOpen(false)} />
        </DialogHeader>

        <form onSubmit={handleSaveContent}>
          <DialogContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="content-title">Resource Title</Label>
              <Input
                id="content-title"
                placeholder="e.g. Lecture 1: Introduction to Trees"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="content-sub">Subject</Label>
                <select
                  id="content-sub"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                  required
                >
                  <option value="">Select a Subject</option>
                  {subjects?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-context">Academic Context</Label>
                <select
                  id="content-context"
                  value={academicContext}
                  onChange={(e) => setAcademicContext(e.target.value as AcademicContext)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value="LECTURE">Lecture</option>
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="content-source">Source Type</Label>
                <select
                  id="content-source"
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as ContentSourceType)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value="UPLOAD">File Upload (PDF, Doc, Image)</option>
                  <option value="EXTERNAL_LINK">External URL (YouTube, Drive)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-rtype">Resource Format</Label>
                <select
                  id="content-rtype"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value as ResourceType)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCUMENT">Document (Word, PPT)</option>
                  <option value="VIDEO">Video</option>
                  <option value="IMAGE">Image</option>
                  <option value="LINK">Link</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {sourceType === "UPLOAD" ? (
              <div className="space-y-1.5">
                <Label htmlFor="content-file">Select File (Max 20MB)</Label>
                <Input
                  id="content-file"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  required
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="content-url">External Resource URL</Label>
                <Input
                  id="content-url"
                  type="url"
                  placeholder="https://drive.google.com/... or https://youtube.com/..."
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="content-status">Publication Status</Label>
              <select
                id="content-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
              >
                <option value="PUBLISHED">PUBLISHED (Available immediately)</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-desc">Description / Notes</Label>
              <textarea
                id="content-desc"
                rows={3}
                placeholder="Overview of this study resource..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
              />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Upload & Save
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Modal: Edit Content */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditingContent(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Study Material</DialogTitle>
          <DialogClose onClose={() => setIsEditOpen(false)} />
        </DialogHeader>

        <form onSubmit={handleUpdateContent}>
          <DialogContent className="space-y-4">
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
                  onChange={(e) => setEditSubjectId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                  required
                >
                  <option value="">Select a Subject</option>
                  {subjects?.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
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

            {editingContent?.sourceType === "EXTERNAL_LINK" && (
              <div className="space-y-1.5">
                <Label htmlFor="edit-content-url">External Resource URL</Label>
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
              <Label htmlFor="edit-content-status">Publication Status</Label>
              <select
                id="edit-content-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as ContentStatus)}
                className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
              >
                <option value="PUBLISHED">PUBLISHED (Available immediately)</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-content-description">Description / Notes</Label>
              <textarea
                id="edit-content-description"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="flex w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
              />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
