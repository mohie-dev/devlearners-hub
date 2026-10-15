import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 min-h-11 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-[#667085]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all sm:min-h-0",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
