"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth/token";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function HomeContent() {
  const [isAuth] = useState(() => {
    if (typeof window === "undefined") return false;
    return isAuthenticated();
  });

  return (
    <div className="min-h-screen bg-[#F2F5FA] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#DCE5F5] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#193DA0] text-[#FFC329] flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-[#17194D]">DevLearners</span>{" "}
              <span className="font-bold text-lg text-[#193DA0]">Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuth ? (
              <Link href="/dashboard">
                <Button className="gap-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#17194D] max-w-3xl leading-[1.15]">
          Master Your Courses, Track Tasks, and Hit Deadlines Confidently
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[#667085] max-w-2xl leading-relaxed">
          DevLearners Hub allows students to explore academic subjects, pick tasks directly into their personal learning plan, and monitor real-time completion progress.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={isAuth ? "/dashboard" : "/register"}>
            <Button size="lg" className="gap-2 shadow-md">
              <span>{isAuth ? "Open My Dashboard" : "Create Student Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/subjects">
            <Button variant="outline" size="lg" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Browse Subjects</span>
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F5] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#193DA0] flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#17194D] text-base mb-2">Subject Discovery</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Filter by academic department and study level to find courses and published assignments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F5] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#17194D] text-base mb-2">Personal Task List</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Add individual tasks to your own personal workspace to prioritize what matters to you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F5] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#17194D] text-base mb-2">Progress Tracking</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Mark tasks as completed, keep track of pending deadlines, and stay on top of your semester.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCE5F5] bg-white py-6 text-center text-xs text-[#667085]">
        <div className="max-w-6xl mx-auto px-4">
          © 2026 DevLearners Hub. Built for student success.
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F5FA]" />}>
      <HomeContent />
    </Suspense>
  );
}
