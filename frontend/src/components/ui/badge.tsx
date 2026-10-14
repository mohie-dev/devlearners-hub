import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "pending" | "completed" | "department" | "level" | "outline" | "accent";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#F2F5FA] text-[#17194D] border-[#DCE5F5]",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    department: "bg-blue-50 text-[#193DA0] border-blue-200 font-semibold",
    level: "bg-indigo-50 text-indigo-700 border-indigo-200",
    outline: "text-[#172033] border-[#DCE5F5] bg-transparent",
    accent: "bg-[#FFC329]/20 text-[#17194D] border-[#FFC329]/40 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
