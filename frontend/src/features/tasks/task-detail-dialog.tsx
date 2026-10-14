"use client";

import React from "react";
import { TaskResponse } from "@/types";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, BookOpen, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TaskDetailDialogProps {
  task: TaskResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask?: (task: TaskResponse) => void;
  isAdding?: boolean;
  isAlreadyAdded?: boolean;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onAddTask,
  isAdding = false,
  isAlreadyAdded = false,
}: TaskDetailDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Badge variant="department">{task.academicContext}</Badge>
          {task.dueAt ? (
            <Badge variant="pending" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Deadline</span>
            </Badge>
          ) : (
            <Badge variant="outline">No Deadline</Badge>
          )}
        </div>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>

      <DialogContent>
        <div>
          <DialogTitle className="text-xl font-bold text-[#17194D] mb-2">{task.title}</DialogTitle>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#193DA0]" />
            <span>Subject: <strong className="text-[#172033]">{task.subjectName}</strong></span>
          </div>
        </div>

        <div className="bg-[#F2F5FA] rounded-xl p-4 border border-[#DCE5F5] space-y-2">
          <div className="text-xs font-semibold text-[#17194D] uppercase tracking-wider">
            Task Description
          </div>
          <p className="text-sm text-[#172033] leading-relaxed whitespace-pre-wrap">
            {task.description || "No specific instructions or description provided for this task."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-[#DCE5F5] bg-white">
            <Calendar className="w-4 h-4 text-[#193DA0] mt-0.5" />
            <div>
              <p className="text-xs text-[#667085]">Due Date</p>
              <p className="text-xs font-medium text-[#172033]">
                {task.dueAt ? formatDate(task.dueAt) : "Open-ended (No due date)"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-[#DCE5F5] bg-white">
            <Tag className="w-4 h-4 text-[#193DA0] mt-0.5" />
            <div>
              <p className="text-xs text-[#667085]">Academic Context</p>
              <p className="text-xs font-medium text-[#172033]">{task.academicContext}</p>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        {onAddTask && (
          <Button
            variant={isAlreadyAdded ? "secondary" : "primary"}
            disabled={isAlreadyAdded || isAdding}
            isLoading={isAdding}
            onClick={() => onAddTask(task)}
          >
            {isAlreadyAdded ? (
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Already in My Tasks
              </span>
            ) : (
              "Add to My Tasks"
            )}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}
