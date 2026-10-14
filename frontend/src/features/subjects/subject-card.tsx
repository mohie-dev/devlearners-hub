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
    <Card className="flex flex-col h-full hover:shadow-md transition-all hover:border-[#193DA0]/40 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="department">{subject.department}</Badge>
          <Badge variant="level">Level {subject.level}</Badge>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-[#193DA0]/10 text-[#193DA0] mt-0.5 group-hover:bg-[#193DA0] group-hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base line-clamp-1">{subject.name}</CardTitle>
            <span className="text-xs font-mono text-[#667085] uppercase tracking-wide">
              {subject.code}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-[#667085] line-clamp-3 leading-relaxed">
          {subject.description || "No description provided for this subject."}
        </p>
      </CardContent>

      <CardFooter className="pt-3">
        <Link href={`/subjects/${subject.id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:bg-[#193DA0] group-hover:text-white transition-all">
            <span>Browse Content & Tasks</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
