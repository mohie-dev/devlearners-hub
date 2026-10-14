import React, { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F2F5FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#193DA0] text-[#FFC329] flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl text-[#17194D]">DevLearners Hub</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense fallback={<div className="text-center p-8 text-sm text-[#667085]">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
