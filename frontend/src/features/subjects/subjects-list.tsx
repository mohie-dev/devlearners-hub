"use client";

import React, { useState } from "react";
import { useSubjects } from "@/hooks/use-subjects";
import { FilterSubjectsParams } from "@/types";
import { SubjectCard } from "./subject-card";
import { SubjectFilters } from "./subject-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubjectsList() {
  const [filters, setFilters] = useState<FilterSubjectsParams>({});
  const { data: subjects, isLoading, isError, error, refetch } = useSubjects(filters);

  return (
    <div className="space-y-6">
      <SubjectFilters filters={filters} onChange={setFilters} />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 rounded-xl border border-[#DCE5F5] bg-white p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-red-900 mb-1">Failed to load subjects</h3>
          <p className="text-sm text-red-600 mb-4">
            {(error as Error)?.message || "Could not retrieve the subjects list from the server."}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && (!subjects || subjects.length === 0) && (
        <div className="bg-white border border-[#DCE5F5] rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F2F5FA] flex items-center justify-center text-[#667085] mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#17194D] mb-1">No subjects found</h3>
          <p className="text-sm text-[#667085] mb-4">
            No subjects match your current filter criteria or there are no active subjects published yet.
          </p>
          <Button variant="secondary" onClick={() => setFilters({})}>
            Reset Filters
          </Button>
        </div>
      )}

      {!isLoading && !isError && subjects && subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}
