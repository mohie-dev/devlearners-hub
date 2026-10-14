"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { SubjectDepartment, SubjectLevel } from "@/types";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(120),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  department: z.enum(["CS", "IS", "IT", "GENERAL"], {
    message: "Please select an academic department",
  }),
  studyLevel: z.number().min(1, "Study level must be between 1 and 4").max(4, "Study level must be between 1 and 4"),
});

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  department: "CS" | "IS" | "IT" | "GENERAL";
  studyLevel: number;
};

export function RegisterForm() {
  const router = useRouter();
  const { register: registerStudent } = useAuth();
  const { success } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      department: "CS",
      studyLevel: 1,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerStudent({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        department: data.department as SubjectDepartment,
        studyLevel: Number(data.studyLevel) as SubjectLevel,
      });
      success("Account created successfully! Welcome to DevLearners Hub.");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || "Failed to create account. Please check the details.");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md border-[#DCE5F5]">
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#17194D]">Create Student Account</CardTitle>
        <CardDescription className="text-sm text-[#667085]">
          Join DevLearners Hub to track tasks and discover course materials
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="e.g. Abdelrahman Mohie"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password (min. 8 characters)</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                {...register("department")}
                className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0] transition-all"
              >
                <option value="CS">Computer Science (CS)</option>
                <option value="IS">Information Systems (IS)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="GENERAL">General Studies</option>
              </select>
              {errors.department && (
                <p className="text-xs text-red-500 font-medium">{errors.department.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="studyLevel">Academic Level</Label>
              <select
                id="studyLevel"
                {...register("studyLevel", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-lg border border-[#DCE5F5] bg-white px-3 py-2 text-sm text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193DA0] transition-all"
              >
                <option value={1}>Level 1 (First Year)</option>
                <option value={2}>Level 2 (Second Year)</option>
                <option value={3}>Level 3 (Third Year)</option>
                <option value={4}>Level 4 (Fourth Year)</option>
              </select>
              {errors.studyLevel && (
                <p className="text-xs text-red-500 font-medium">{errors.studyLevel.message}</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Create Account
          </Button>

          <p className="text-center text-xs text-[#667085]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#193DA0] hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
