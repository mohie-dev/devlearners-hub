import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex min-h-11 min-w-11 items-center justify-center font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer sm:min-h-0 sm:min-w-0";

    const variants = {
      primary: "bg-[#193DA0] text-white hover:bg-[#132f80] active:scale-[0.98] shadow-sm",
      secondary: "bg-[#F2F5FA] text-[#17194D] hover:bg-[#e4ebf7] border border-[#DCE5F5]",
      outline: "border border-[#DCE5F5] bg-white text-[#193DA0] hover:bg-[#F2F5FA] active:bg-[#e4ebf7]",
      ghost: "text-[#667085] hover:text-[#172033] hover:bg-[#F2F5FA]",
      destructive: "bg-[#DC2626] text-white hover:bg-[#b91c1c] active:scale-[0.98]",
      accent: "bg-[#FFC329] text-[#17194D] font-semibold hover:bg-[#e5ad20] active:scale-[0.98] shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
