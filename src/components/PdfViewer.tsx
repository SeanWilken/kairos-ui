import { ExternalLink, FileText } from "lucide-react";

import { cn } from "./ui/utils";

export type PdfViewerProps = {
  src: string;
  title?: string;
  className?: string;
  height?: number | string;
};

export function PdfViewer({ src, title = "PDF document", className, height = 720 }: PdfViewerProps) {
  return (
    <div className={cn("w-full min-w-0 overflow-hidden rounded-lg border border-border bg-background", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{title}</span>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2"
        >
          Open in new tab
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <iframe title={title} src={src} className="w-full bg-white" style={{ height }} />
    </div>
  );
}
