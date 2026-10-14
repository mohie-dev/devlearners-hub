import React from "react";
import { ProfileCard } from "@/features/profile/profile-card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17194D]">Student Profile</h1>
        <p className="text-sm text-[#667085] mt-1">
          View your academic registration details and account profile.
        </p>
      </div>

      <ProfileCard />
    </div>
  );
}
