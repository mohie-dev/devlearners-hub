"use client";

import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface RemoveTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle: string;
  isRemoving?: boolean;
}

export function RemoveTaskDialog({
  open,
  onOpenChange,
  onConfirm,
  taskTitle,
  isRemoving = false,
}: RemoveTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <DialogTitle>Remove from My Tasks</DialogTitle>
        </div>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>

      <DialogContent>
        <p className="text-sm text-[#172033] leading-relaxed">
          Are you sure you want to remove <strong className="text-[#17194D]">&ldquo;{taskTitle}&rdquo;</strong> from your personal task list?
        </p>
        <p className="text-xs text-[#667085]">
          You can always re-add this task later from the subjects browsing catalog.
        </p>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRemoving}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} isLoading={isRemoving}>
          Remove Task
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
