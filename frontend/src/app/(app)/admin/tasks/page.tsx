"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects } from "@/hooks/use-subjects";
import { useAdminTasks, useAdminTaskMutations } from "@/hooks/use-admin";
import { useToast } from "@/components/providers/toast-provider";
import { AcademicContext, TaskResponse, TaskStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ListTodo, Plus, Trash2, Edit3, ArrowLeft, Shield, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminTasksPage() {
  const { user } = useAuth();
  const { data: tasks, isLoading, refetch } = useAdminTasks();
  const { data: subjects } = useSubjects();
  const { createTask, updateTask, deleteTask } = useAdminTaskMutations();
  const { success, error: toastError } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [academicContext, setAcademicContext] = useState<AcademicContext>("GENERAL");
  const [dueAt, setDueAt] = useState("");
  const [status, setStatus] = useState<TaskStatus>("PUBLISHED");
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
    setAcademicContext("GENERAL");
    setDueAt("");
    setStatus("PUBLISHED");
    setIsCreateOpen(true);
  };

  const openEditDialog = (t: TaskResponse) => {
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description || "");
    setSubjectId(t.subjectId);
    setAcademicContext(t.academicContext);
    setDueAt(t.dueAt ? new Date(t.dueAt).toISOString().slice(0, 16) : "");
    setStatus(t.status);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) {
      toastError("Task title and subject are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDueAt = dueAt ? new Date(dueAt).toISOString() : null;

      if (editingTask) {
        await updateTask({
          id: editingTask.id,
          dto: {
            title: title.trim(),
            description: description.trim() || null,
            subjectId,
            academicContext,
            dueAt: formattedDueAt,
            status,
          },
        });
        success(`Task "${title}" updated successfully!`);
        setEditingTask(null);
      } else {
        const created = await createTask({
          title: title.trim(),
          description: description.trim() || null,
          subjectId,
          academicContext,
          dueAt: formattedDueAt,
        });

        // Newly created tasks start as DRAFT in backend; if admin chose PUBLISHED, update status
        if (status === "PUBLISHED") {
          await updateTask({
            id: created.id,
            dto: { status: "PUBLISHED" },
          });
        }

        success(`Task "${title}" created successfully!`);
        setIsCreateOpen(false);
      }
      refetch();
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to save task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string, taskTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${taskTitle}"?`)) return;
    try {
      await deleteTask(id);
      success(`Task "${taskTitle}" deleted.`);
      refetch();
    } catch (err: unknown) {
      const e = err as Error;
      toastError(e.message || "Failed to delete task.");
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
          <h1 className="text-2xl font-bold text-[#17194D]">Manage Tasks</h1>
          <p className="text-sm text-[#667085]">Author, publish, and manage coursework assignments</p>
        </div>

        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[#17194D]">All Course Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="text-center py-10">
              <ListTodo className="w-8 h-8 text-[#667085] mx-auto mb-2" />
              <p className="text-sm text-[#667085]">No tasks created yet. Author your first task!</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 lg:hidden">
                {tasks.map((task) => (
                  <article key={task.id} className="rounded-xl border border-[#DCE5F5] bg-white p-4 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 break-words font-semibold text-[#17194D]">{task.title}</h3>
                      <Badge
                        variant={
                          task.status === "PUBLISHED"
                            ? "completed"
                            : task.status === "DRAFT"
                              ? "pending"
                              : "outline"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#667085]">
                      {task.description || "No description"}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="department">{task.academicContext}</Badge>
                      <span className="flex items-center gap-1 text-xs text-[#667085]">
                        <Clock className="h-3.5 w-3.5" />
                        {task.dueAt ? formatDate(task.dueAt) : "No deadline"}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(task)} className="flex-1">
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DCE5F5] text-xs font-semibold text-[#667085] uppercase">
                    <th className="pb-3 px-2">Task Title</th>
                    <th className="pb-3 px-2">Context</th>
                    <th className="pb-3 px-2">Deadline</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F5]/60">
                  {tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F2F5FA]/50 transition-colors">
                      <td className="py-3 px-2">
                        <p className="font-semibold text-[#17194D]">{t.title}</p>
                        <p className="text-xs text-[#667085] line-clamp-1">{t.description || "No description"}</p>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="department">{t.academicContext}</Badge>
                      </td>
                      <td className="py-3 px-2 text-xs text-[#667085]">
                        {t.dueAt ? (
                          <span className="flex items-center gap-1 text-amber-700">
                            <Clock className="w-3 h-3" />
                            {formatDate(t.dueAt)}
                          </span>
                        ) : (
                          "No deadline"
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={
                            t.status === "PUBLISHED"
                              ? "completed"
                              : t.status === "DRAFT"
                              ? "pending"
                              : "outline"
                          }
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(t)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTask(t.id, t.title)}
                          className="h-8 px-2 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal: Create or Edit Task */}
      <Dialog
        open={isCreateOpen || !!editingTask}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingTask(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Course Task" : "Create New Task"}</DialogTitle>
          <DialogClose
            onClose={() => {
              setIsCreateOpen(false);
              setEditingTask(null);
            }}
          />
        </DialogHeader>

        <form onSubmit={handleSaveTask}>
          <DialogContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="e.g. Implement Binary Search Tree"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="task-sub">Subject</Label>
                <select
                  id="task-sub"
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
                <Label htmlFor="task-context">Academic Context</Label>
                <select
                  id="task-context"
                  value={academicContext}
                  onChange={(e) => setAcademicContext(e.target.value as AcademicContext)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value="GENERAL">General</option>
                  <option value="LECTURE">Lecture</option>
                  <option value="TUTORIAL">Tutorial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="task-deadline">Deadline (Optional)</Label>
                <Input
                  id="task-deadline"
                  type="datetime-local"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-status">Status</Label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033]"
                >
                  <option value="PUBLISHED">PUBLISHED (Visible to Students)</option>
                  <option value="DRAFT">DRAFT (Hidden)</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-desc">Instructions & Description</Label>
              <textarea
                id="task-desc"
                rows={4}
                placeholder="Detailed instructions for students..."
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
                setEditingTask(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingTask ? "Save Task Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
