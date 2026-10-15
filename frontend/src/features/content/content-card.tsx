import React from "react";
import { ContentItem } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Video,
  FileCode,
  Image as ImageIcon,
  ExternalLink,
  Download,
  FolderOpen,
} from "lucide-react";

interface ContentCardProps {
  content: ContentItem;
}

export function ContentCard({ content }: ContentCardProps) {
  const getResourceIcon = () => {
    switch (content.resourceType) {
      case "PDF":
        return <FileText className="w-5 h-5 text-red-600" />;
      case "VIDEO":
        return <Video className="w-5 h-5 text-purple-600" />;
      case "DOCUMENT":
        return <FileCode className="w-5 h-5 text-blue-600" />;
      case "IMAGE":
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case "LINK":
        return <ExternalLink className="w-5 h-5 text-[#193DA0]" />;
      default:
        return <FolderOpen className="w-5 h-5 text-[#667085]" />;
    }
  };

  const formatFileSize = (bytesStr: string | null) => {
    if (!bytesStr) return null;
    const bytes = Number(bytesStr);
    if (isNaN(bytes)) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileSize = formatFileSize(content.sizeBytes);

  return (
    <Card className="flex flex-col h-full border-[#DCE5F5] transition-[box-shadow,border-color] duration-150 ease-out hover:shadow-md group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="department">{content.academicContext}</Badge>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline">{content.resourceType}</Badge>
            {content.sourceType === "UPLOAD" && (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                File
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-[#F2F5FA] mt-0.5 border border-[#DCE5F5]/60 transition-colors duration-150">
            {getResourceIcon()}
          </div>
          <div>
            <CardTitle className="text-base text-[#17194D] group-hover:text-[#193DA0] transition-colors line-clamp-2">
              {content.title}
            </CardTitle>
            {fileSize && (
              <span className="text-[11px] text-[#667085] font-mono mt-0.5 block">
                Size: {fileSize}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-[#667085] line-clamp-3 leading-relaxed">
          {content.description || "No description provided for this resource."}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t border-[#DCE5F5]/40">
        {content.resourceUrl ? (
          <a
            href={content.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 group-hover:bg-[#193DA0] group-hover:text-white transition-colors duration-150"
            >
              {content.sourceType === "UPLOAD" ? (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / View Resource</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open External Link</span>
                </>
              )}
            </Button>
          </a>
        ) : (
          <Button variant="outline" size="sm" className="w-full" disabled>
            Not Available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
