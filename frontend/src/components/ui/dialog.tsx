"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 motion-reduce:animate-none motion-reduce:transition-none"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative z-50 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#DCE5F5] bg-white shadow-xl animate-in zoom-in-95 duration-200 motion-reduce:animate-none",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[#DCE5F5] px-4 py-4 sm:px-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-[#17194D]", className)} {...props}>
      {children}
    </h3>
  );
}

export function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 overflow-y-auto space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex justify-end gap-3 border-t border-[#DCE5F5] bg-[#F2F5FA] px-4 py-4 sm:px-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close dialog"
      onClick={onClose}
      className="text-[#667085] hover:text-[#172033] p-1.5 rounded-lg hover:bg-[#F2F5FA] transition-colors"
    >
      <X className="w-5 h-5" />
    </button>
  );
}
