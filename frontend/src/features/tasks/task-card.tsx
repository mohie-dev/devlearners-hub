"use client";

import React from "react";
import { TaskResponse } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Check, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TaskCardProps {
  task: TaskResponse;
  isAlreadyAdded?: boolean;
  isAdding?: boolean;
  onAddTask: (task: TaskResponse) => void;
  onViewDetails: (task: TaskResponse) => void;
}

export function TaskCard({
  task,
  isAlreadyAdded = false,
  isAdding = false,
  onAddTask,
  onViewDetails,
}: TaskCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-all hover:border-[#193DA0]/30 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="department">{task.academicContext}</Badge>
          {task.dueAt ? (
            <div className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              <span>Due: {formatDate(task.dueAt)}</span>
            </div>
          ) : (
            <Badge variant="outline">No Deadline</Badge>
          )}
        </div>

        <CardTitle className="text-base text-[#17194D] group-hover:text-[#193DA0] transition-colors line-clamp-2">
          {task.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-[#667085] line-clamp-3 leading-relaxed">
          {task.description || "No description provided."}
        </p>
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails(task)}
        >
          <Eye className="w-3.5 h-3.5 mr-1 text-[#667085]" />
          <span>Details</span>
        </Button>

        <Button
          variant={isAlreadyAdded ? "secondary" : "primary"}
          size="sm"
          className="flex-1"
          disabled={isAlreadyAdded || isAdding}
          isLoading={isAdding}
          onClick={() => onAddTask(task)}
        >
          {isAlreadyAdded ? (
            <span className="flex items-center gap-1 text-emerald-700 font-semibold text-xs">
              <Check className="w-3.5 h-3.5" />
              Added
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
