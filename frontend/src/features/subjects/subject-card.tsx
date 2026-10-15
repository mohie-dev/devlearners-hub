import React from "react";
import Link from "next/link";
import { Subject } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Card className="flex h-full flex-col border-[#DCE5F5] shadow-sm transition-[border-color,box-shadow] duration-150 ease-out hover:border-[#B8CAEC] hover:shadow-md focus-within:border-[#193DA0] focus-within:shadow-md motion-reduce:transition-none">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Badge variant="department">{subject.department}</Badge>
          <Badge variant="level">Level {subject.level}</Badge>
        </div>
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="mt-0.5 rounded-lg bg-[#193DA0]/10 p-2 text-[#193DA0]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="line-clamp-2 text-base text-[#17194D]">{subject.name}</CardTitle>
            <span className="font-mono text-xs uppercase tracking-wide text-[#667085]">
              {subject.code}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-[#667085]">
          {subject.description || "No description provided for this subject."}
        </p>
      </CardContent>

      <CardFooter className="pt-3">
        <Link href={`/subjects/${subject.id}`} className="w-full">
          <Button variant="outline" className="w-full gap-2 transition-colors duration-150 motion-reduce:transition-none">
            <span>Browse Content & Tasks</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
