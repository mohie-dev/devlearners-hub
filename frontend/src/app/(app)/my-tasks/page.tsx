import React from "react";
import { MyTasksList } from "@/features/student-tasks/my-tasks-list";

export default function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17194D]">My Learning Tasks</h1>
        <p className="text-sm text-[#667085] mt-1">
          Track your selected coursework, manage progress, and mark tasks as completed as you study.
        </p>
      </div>

      <MyTasksList />
    </div>
  );
}
