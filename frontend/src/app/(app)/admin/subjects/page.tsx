"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { useAdminSubjectMutations } from "@/hooks/use-admin";
import { useToast } from "@/components/providers/toast-provider";
import { Subject, SubjectDepartment } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { BookOpen, Plus, Archive, Edit3, ArrowLeft, Shield } from "lucide-react";

export default function AdminSubjectsPage() {
  const { user } = useAuth();
  const { data: subjects, isLoading, refetch } = useSubjects();
  const { createSubject, updateSubject, archiveSubject } = useAdminSubjectMutations();
  const { success, error: toastError } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<number>(1);
  const [department, setDepartment] = useState<SubjectDepartment>("CS");
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
    setName("");
    setCode("");
    setDescription("");
    setLevel(1);
    setDepartment("CS");
    setIsCreateOpen(true);
  };

  const openEditDialog = (s: Subject) => {
    setEditingSubject(s);
    setName(s.name);
    setCode(s.code);
    setDescription(s.description || "");
    setLevel(s.level);
    setDepartment(s.department);
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toastError("Subject name and code are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await updateSubject({
          id: editingSubject.id,
          dto: {
            name: name.trim(),
            code: code.trim().toUpperCase(),
            description: description.trim() || null,
            level: Number(level),
            department,
          },
        });
        success(`Subject "${name}" updated successfully!`);
        setEditingSubject(null);
      } else {
        await createSubject({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim() || null,
          level: Number(level),
          department,
        });
        success(`Subject "${name}" created successfully!`);
        setIsCreateOpen(false);
      }
      refetch();
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to save subject.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveSubject = async (id: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to archive "${subjectName}"?`)) return;
    try {
      await archiveSubject(id);
      success(`Subject "${subjectName}" archived.`);
      refetch();
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to archive subject.");
    }
  };

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
          <h1 className="text-2xl font-bold text-[#17194D]">Manage Subjects</h1>
          <p className="text-sm text-[#667085]">Create, edit, and organize academic courses</p>
        </div>

        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>New Subject</span>
        </Button>
      </div>

      {/* Subjects Table / List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[#17194D]">All Registered Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !subjects || subjects.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-8 h-8 text-[#667085] mx-auto mb-2" />
              <p className="text-sm text-[#667085]">No subjects found. Create your first subject!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DCE5F5] text-xs font-semibold text-[#667085] uppercase">
                    <th className="pb-3 px-2">Code</th>
                    <th className="pb-3 px-2">Subject Name</th>
                    <th className="pb-3 px-2">Department</th>
                    <th className="pb-3 px-2">Level</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F5]/60">
                  {subjects.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F2F5FA]/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-[#193DA0]">{s.code}</td>
                      <td className="py-3 px-2 font-medium text-[#17194D]">
                        <Link href={`/subjects/${s.id}`} className="hover:underline">
                          {s.name}
                        </Link>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="department">{s.department}</Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="level">Level {s.level}</Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={s.status === "ACTIVE" ? "completed" : "outline"}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(s)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        {s.status === "ACTIVE" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleArchiveSubject(s.id, s.name)}
                            className="h-8 px-2 text-xs"
                          >
                            <Archive className="w-3.5 h-3.5 mr-1" />
                            Archive
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Create or Edit Subject */}
      <Dialog
        open={isCreateOpen || !!editingSubject}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingSubject(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{editingSubject ? "Edit Subject" : "Create New Subject"}</DialogTitle>
          <DialogClose
            onClose={() => {
              setIsCreateOpen(false);
              setEditingSubject(null);
            }}
          />
        </DialogHeader>
        <form onSubmit={handleSaveSubject}>
          <DialogContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sub-name">Subject Name</Label>
              <Input
                id="sub-name"
                placeholder="e.g. Algorithms & Complexity"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-code">Subject Code</Label>
              <Input
                id="sub-code"
                placeholder="e.g. CS202"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sub-dept">Department</Label>
                <select
                  id="sub-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as SubjectDepartment)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value="CS">Computer Science (CS)</option>
                  <option value="IS">Information Systems (IS)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="GENERAL">General Studies</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sub-level">Academic Level</Label>
                <select
                  id="sub-level"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value={1}>Level 1</option>
                  <option value={2}>Level 2</option>
                  <option value={3}>Level 3</option>
                  <option value={4}>Level 4</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-desc">Description</Label>
              <textarea
                id="sub-desc"
                rows={3}
                placeholder="Course curriculum and overview..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
              />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingSubject(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingSubject ? "Save Changes" : "Create Subject"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
