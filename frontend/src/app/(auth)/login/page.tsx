import React, { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";
import { SiteLogo } from "@/components/layout/site-logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F2F5FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 text-center">
        <Link href="/" className="inline-flex items-center">
          <SiteLogo
            variant="primary-light"
            className="h-auto w-56 sm:w-64"
          />
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
