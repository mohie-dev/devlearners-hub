import React from "react";
import { SubjectsList } from "@/features/subjects/subjects-list";

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17194D]">Subjects</h1>
        <p className="text-sm text-[#667085] mt-1">
          Explore active subjects, browse available tasks, and add assignments to your personal learning list.
        </p>
      </div>

      <SubjectsList />
    </div>
  );
}
