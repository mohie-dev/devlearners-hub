"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useAuthSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/layout/site-logo";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Menu,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

function HomeContent() {
  const { isLoggedIn: isAuth } = useAuthSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#F7F9FE]">
      <header className="sticky top-0 z-30 border-b border-[#DCE5F5]/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-[4.5rem] items-center justify-between">
            <Link
              href={isAuth ? "/dashboard" : "/"}
              className="group flex items-center gap-3 transition-opacity hover:opacity-85"
            >
              <SiteLogo variant="primary-light" className="h-10 w-auto sm:h-11" />
            </Link>

            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-3 md:flex"
            >
              <Link
                href="/subjects"
                className="mr-2 text-sm font-semibold text-[#667085] transition-colors hover:text-[#193DA0]"
              >
                Explore subjects
              </Link>
              {isAuth ? (
                <Link href="/dashboard">
                  <Button className="gap-2 rounded-xl px-5">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl px-4"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="rounded-xl px-4">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </nav>

            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-[#DCE5F5] md:hidden"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className={`${isMenuOpen ? "grid grid-rows-[1fr] pb-4 opacity-100" : "pointer-events-none grid grid-rows-[0fr] pb-0 opacity-0"} transition-[grid-template-rows,opacity,padding] duration-200 ease-out motion-reduce:transition-none md:hidden`}
          >
            <div className="overflow-hidden">
              <div className="grid gap-2 rounded-2xl border border-[#DCE5F5] bg-[#F7F9FE] p-3">
                <Link
                  href="/subjects"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#344054] transition-colors hover:bg-white hover:text-[#193DA0]"
                >
                  <BookOpen className="h-4 w-4 text-[#193DA0]" />
                  Browse subjects
                  <ArrowUpRight className="ml-auto h-4 w-4 text-[#98A2B3]" />
                </Link>
                {isAuth ? (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-between rounded-xl px-4">
                      <span>Go to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full rounded-xl">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="page-enter relative isolate flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
          <div className="absolute -right-32 top-72 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" />
        </div>

        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-20">
          <div className="landing-enter text-center lg:text-left">
            <h1 className="mx-auto max-w-2xl text-[2.55rem] font-black leading-[1.08] tracking-[-0.045em] text-[#17194D] sm:text-5xl lg:mx-0 lg:text-[3.65rem]">
              Make this your
              <span className="block pb-1 text-[#193DA0]">
                best semester yet.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-7 text-[#667085] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
              Find your courses, plan your tasks, and keep every deadline in
              sight all in one student-friendly space.
            </p>

            <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center lg:justify-start">
              <Link
                href={isAuth ? "/dashboard" : "/register"}
                className="group w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="landing-cta w-full gap-2.5 rounded-xl px-5 shadow-lg shadow-blue-900/15 sm:w-auto"
                >
                  <span>
                    {isAuth
                      ? "Open My Dashboard"
                      : "Start Tracking Your Progress"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/subjects" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 rounded-xl border-[#DCE5F5] bg-white/90 sm:w-auto"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Browse Subjects</span>
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[#667085] sm:text-sm lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Made for
                students
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" /> Keep your momentum
              </span>
            </div>
          </div>

          <div className="landing-enter landing-enter-delay-1 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -right-1 top-2 z-10 flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-3 py-2.5 shadow-lg shadow-blue-950/10 sm:-right-4 sm:top-8 sm:px-4 sm:py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#17194D] sm:text-xs">
                  You&apos;re on track!
                </p>
                <p className="mt-0.5 text-[10px] text-[#667085] sm:text-[11px]">
                  Keep up the great work
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-[#193DA0] via-[#254CB0] to-[#17194D] p-4 shadow-2xl shadow-blue-950/20 sm:rounded-[2rem] sm:p-6">
              <div
                aria-hidden="true"
                className="absolute -right-14 -top-20 h-52 w-52 rounded-full border-[30px] border-white/5"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#FFC329]/10 blur-2xl"
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-100/75 sm:text-sm">
                      Your learning space
                    </p>
                    <p className="mt-1 text-lg font-extrabold tracking-tight text-white sm:text-xl">
                      This week
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#FFC329] ring-1 ring-white/10 sm:h-12 sm:w-12">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:mt-6 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-blue-100/80">
                        Weekly progress
                      </p>
                      <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
                        80%
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#FFC329] border-r-white/20 text-xs font-bold text-white sm:h-14 sm:w-14">
                      4/5
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="landing-progress h-full w-4/5 rounded-full bg-gradient-to-r from-[#FFC329] to-[#FFE18A]" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3.5 sm:p-4">
                    <div className="flex items-center gap-2 text-blue-100/80">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-[11px] font-semibold sm:text-xs">
                        My subjects
                      </span>
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                      06
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3.5 sm:p-4">
                    <div className="flex items-center gap-2 text-blue-100/80">
                      <Clock3 className="h-4 w-4" />
                      <span className="text-[11px] font-semibold sm:text-xs">
                        Coming up
                      </span>
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                      02 tasks
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-md shadow-blue-950/10 sm:p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[#17194D] sm:text-sm">
                      Next up: Course assignment
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#667085] sm:text-xs">
                      Your plan, your pace
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#193DA0]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mb-6 text-center sm:mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#193DA0]">
              Everything in one place
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#17194D] sm:text-3xl">
              Your semester, made simpler
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            <div className="landing-card landing-enter landing-enter-delay-1 rounded-2xl border border-[#DCE5F5] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#193DA0]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-[#17194D]">
                Discover your subjects
              </h3>
              <p className="text-sm leading-relaxed text-[#667085]">
                Find courses and published assignments by academic department
                and study level.
              </p>
            </div>

            <div className="landing-card landing-enter landing-enter-delay-2 rounded-2xl border border-[#DCE5F5] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-[#17194D]">
                Plan your tasks
              </h3>
              <p className="text-sm leading-relaxed text-[#667085]">
                Build a personal task list that helps you focus on what matters
                most.
              </p>
            </div>

            <div className="landing-card landing-enter landing-enter-delay-3 rounded-2xl border border-[#DCE5F5] bg-white p-5 shadow-sm sm:col-span-2 sm:p-6 lg:col-span-1">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-[#17194D]">
                See your progress
              </h3>
              <p className="text-sm leading-relaxed text-[#667085]">
                Track completed work and upcoming deadlines to stay confident
                all semester.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DCE5F5] bg-white py-6 text-center text-xs text-[#667085]">
        <div className="mx-auto max-w-6xl px-4 text-sm">
          © 2026 DevLearners Hub. Built by{" "}
          <a
            href="https://www.linkedin.com/in/abdelrahman-mohie-dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-blue-500 transition-colors"
          >
            Mohie.dev
          </a>
          .
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
