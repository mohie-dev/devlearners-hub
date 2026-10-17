"use client";

import React, { useState } from "react";
import { StudentTask, TaskProgressStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RemoveTaskDialog } from "./remove-task-dialog";
import { Clock, CheckCircle2, RotateCcw, Trash2, BookOpen, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StudentTaskDetailDialog } from "./student-task-detail-dialog";

interface StudentTaskCardProps {
  studentTask: StudentTask;
  onUpdateStatus: (taskId: string, newStatus: TaskProgressStatus) => Promise<void>;
  onRemoveTask: (taskId: string) => Promise<void>;
}

export function StudentTaskCard({
  studentTask,
  onUpdateStatus,
  onRemoveTask,
}: StudentTaskCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const { task, status } = studentTask;
  const isCompleted = status === "COMPLETED";

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      const nextStatus = isCompleted ? "PENDING" : "COMPLETED";
      await onUpdateStatus(studentTask.taskId, nextStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemoveTask(studentTask.taskId);
      setIsConfirmOpen(false);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <Card
        className={`flex flex-col h-full transition-[border-color,background-color,box-shadow] duration-150 ease-out border ${
          isCompleted
            ? "border-emerald-200/80 bg-white/90 shadow-xs"
            : "border-[#DCE5F5] bg-white hover:shadow-md"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Badge variant={isCompleted ? "completed" : "pending"}>
                {isCompleted ? "Completed" : "Pending"}
              </Badge>
              <Badge variant="outline">{task.academicContext}</Badge>
            </div>

            <button
              onClick={() => setIsConfirmOpen(true)}
              className="text-[#667085] hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
              title="Remove from My Tasks"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#193DA0]" />
            <span className="font-medium text-[#172033] truncate">
              {task.subject?.name || "Subject Task"}
            </span>
          </div>

          <CardTitle
            className={`text-base font-semibold transition-colors duration-150 ${
              isCompleted ? "line-through text-[#667085]" : "text-[#17194D]"
            }`}
          >
            {task.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <p className="text-sm text-[#667085] line-clamp-2 leading-relaxed">
            {task.description || "No specific instructions provided."}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#667085]">
            <Clock className="w-3.5 h-3.5 text-[#193DA0]" />
            <span>
              {task.dueAt ? `Due: ${formatDate(task.dueAt)}` : "No strict deadline"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 border-t border-[#DCE5F5]/40 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={() => setIsDetailsOpen(true)}
          >
            <Eye className="h-4 w-4" />
            View task details
          </Button>
          <Button
            variant={isCompleted ? "outline" : "primary"}
            size="sm"
            className="w-full"
            isLoading={isUpdating}
            onClick={handleToggleStatus}
          >
            {isCompleted ? (
              <span className="flex items-center gap-1.5 text-amber-700">
                <RotateCcw className="w-3.5 h-3.5" />
                Return to Pending
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                Mark as Completed
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>

      <RemoveTaskDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmRemove}
        taskTitle={task.title}
        isRemoving={isRemoving}
      />
      <StudentTaskDetailDialog
        studentTask={studentTask}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
