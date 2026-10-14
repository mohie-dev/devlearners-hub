import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F2F5FA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#193DA0]/10 text-[#193DA0] flex items-center justify-center mb-4">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#17194D]">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-[#667085] max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
