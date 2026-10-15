"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { FilterSubjectsParams, SubjectDepartment } from "@/types";

interface SubjectFiltersProps {
  filters: FilterSubjectsParams;
  onChange: (filters: FilterSubjectsParams) => void;
}

export function SubjectFilters({ filters, onChange }: SubjectFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value || undefined });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      department: val ? (val as SubjectDepartment) : undefined,
    });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      level: val ? Number(val) : undefined,
    });
  };

  const resetFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Boolean(filters.search || filters.department || filters.level);

  return (
    <div className="bg-white p-4 rounded-xl border border-[#DCE5F5] shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
            <input
              type="text"
              placeholder="Search subjects by name or code..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white pl-9 pr-3 py-2 text-sm text-[#172033] placeholder:text-[#667085]/60 focus-visible:outline-none focus-visible:border-[#193DA0] focus-visible:ring-2 focus-visible:ring-[#193DA0]/20 transition-colors duration-150"
            />
          </div>
        </div>

        {/* Department Filter */}
        <div className="sm:col-span-3">
          <select
            value={filters.department || ""}
            onChange={handleDepartmentChange}
            className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:border-[#193DA0] focus-visible:ring-2 focus-visible:ring-[#193DA0]/20 transition-colors duration-150"
          >
            <option value="">All Departments</option>
            <option value="CS">Computer Science (CS)</option>
            <option value="IS">Information Systems (IS)</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        {/* Level Filter */}
        <div className="sm:col-span-3">
          <select
            value={filters.level || ""}
            onChange={handleLevelChange}
            className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:border-[#193DA0] focus-visible:ring-2 focus-visible:ring-[#193DA0]/20 transition-colors duration-150"
          >
            <option value="">All Academic Levels</option>
            <option value="1">Level 1 (First Year)</option>
            <option value="2">Level 2 (Second Year)</option>
            <option value="3">Level 3 (Third Year)</option>
            <option value="4">Level 4 (Fourth Year)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 text-xs text-[#667085] border-t border-[#DCE5F5]/40">
          <span>Active filters applied</span>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[#DC2626] hover:underline cursor-pointer font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
