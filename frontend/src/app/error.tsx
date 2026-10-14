"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-[#17194D]">Something went wrong</h2>
      <p className="mt-2 text-sm text-[#667085] max-w-sm">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="mt-6">
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
    </div>
  );
}
