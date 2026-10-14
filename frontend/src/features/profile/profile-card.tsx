"use client";

import React from "react";
import { useProfile } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, BookOpen, Layers } from "lucide-react";

export function ProfileCard() {
  const { data: profile, isLoading, isError, error } = useProfile();

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="max-w-2xl mx-auto border-red-200">
        <CardContent className="p-8 text-center text-red-600">
          <p className="font-semibold">Unable to load profile</p>
          <p className="text-xs mt-1">{(error as Error)?.message || "Please sign in again."}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader className="border-b border-[#DCE5F5] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#193DA0] text-[#FFC329] flex items-center justify-center font-bold text-2xl shadow-sm">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-xl text-[#17194D]">{profile.fullName}</CardTitle>
            <div className="text-xs text-[#667085] flex items-center gap-2 mt-1">
              <span>{profile.email}</span>
              <span>•</span>
              <Badge variant="accent">{profile.role}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#DCE5F5] bg-[#F2F5FA]/40">
            <User className="w-5 h-5 text-[#193DA0] mt-0.5" />
            <div>
              <p className="text-xs text-[#667085] font-medium">Full Name</p>
              <p className="text-sm font-semibold text-[#172033] mt-0.5">{profile.fullName}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#DCE5F5] bg-[#F2F5FA]/40">
            <Mail className="w-5 h-5 text-[#193DA0] mt-0.5" />
            <div>
              <p className="text-xs text-[#667085] font-medium">Email Address</p>
              <p className="text-sm font-semibold text-[#172033] mt-0.5">{profile.email}</p>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#DCE5F5] bg-[#F2F5FA]/40">
            <BookOpen className="w-5 h-5 text-[#193DA0] mt-0.5" />
            <div>
              <p className="text-xs text-[#667085] font-medium">Department</p>
              <p className="text-sm font-semibold text-[#172033] mt-0.5">
                {profile.department || "Not Specified"}
              </p>
            </div>
          </div>

          {/* Study Level */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#DCE5F5] bg-[#F2F5FA]/40">
            <Layers className="w-5 h-5 text-[#193DA0] mt-0.5" />
            <div>
              <p className="text-xs text-[#667085] font-medium">Study Level</p>
              <p className="text-sm font-semibold text-[#172033] mt-0.5">
                {profile.studyLevel ? `Level ${profile.studyLevel}` : "Not Specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-[#667085] leading-relaxed">
          <p className="font-semibold text-[#193DA0] mb-0.5">Academic Profile Info</p>
          Your account details are registered with DevLearners Hub. Contact your system administrator if you need to update your department or enrolled academic level.
        </div>
      </CardContent>
    </Card>
  );
}
