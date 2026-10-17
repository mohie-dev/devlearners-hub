"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StudentTask } from "@/types";
import { BookOpen, Calendar, CheckCircle2, Clock, ExternalLink, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StudentTaskDetailDialogProps {
  studentTask: StudentTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentTaskDetailDialog({
  studentTask,
  open,
  onOpenChange,
}: StudentTaskDetailDialogProps) {
  const { task, status } = studentTask;
  const isCompleted = status === "COMPLETED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isCompleted ? "completed" : "pending"}>
            {isCompleted ? "Completed" : "Pending"}
          </Badge>
          <Badge variant="department">{task.academicContext}</Badge>
        </div>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>

      <DialogContent className="space-y-5">
        <div>
          <DialogTitle className="text-xl font-bold text-[#17194D]">
            {task.title}
          </DialogTitle>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#667085]">
            <BookOpen className="h-4 w-4 shrink-0 text-[#193DA0]" />
            <span>
              {task.subject.name}
              {task.subject.code ? ` (${task.subject.code})` : ""}
            </span>
          </div>
        </div>

        <section className="rounded-xl border border-[#DCE5F5] bg-[#F7F9FE] p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
            Task description
          </h4>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#172033]">
            {task.description || "No additional instructions were provided for this task."}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-[#DCE5F5] p-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#193DA0]" />
            <div>
              <p className="text-xs text-[#667085]">Due date</p>
              <p className="mt-1 text-sm font-medium text-[#172033]">
                {task.dueAt ? formatDate(task.dueAt) : "No strict deadline"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#DCE5F5] p-3">
            <Tag className="mt-0.5 h-4 w-4 shrink-0 text-[#193DA0]" />
            <div>
              <p className="text-xs text-[#667085]">Academic context</p>
              <p className="mt-1 text-sm font-medium text-[#172033]">{task.academicContext}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#DCE5F5] p-3">
            {isCompleted ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            )}
            <div>
              <p className="text-xs text-[#667085]">My progress</p>
              <p className="mt-1 text-sm font-medium text-[#172033]">
                {isCompleted ? "Completed" : "Pending"}
                {studentTask.completedAt ? ` · ${formatDate(studentTask.completedAt)}` : ""}
              </p>
            </div>
          </div>
        </div>

        {task.relatedContentItem && (
          <section className="rounded-xl border border-[#DCE5F5] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
              Related study material
            </h4>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#172033]">
                  {task.relatedContentItem.title}
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  {task.relatedContentItem.resourceType} · {task.relatedContentItem.academicContext}
                </p>
              </div>
              {task.relatedContentItem.resourceUrl && (
                <a
                  href={task.relatedContentItem.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#DCE5F5] px-3 text-sm font-medium text-[#193DA0] transition-colors hover:bg-[#F2F5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0]"
                >
                  Open resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </section>
        )}
      </DialogContent>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
