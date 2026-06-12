import { ChatMarkdown } from "./ChatMarkdown";
import { cn } from "./ui/utils";

export type MarkdownViewerProps = {
  content: string;
  className?: string;
};

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div className={cn("w-full min-w-0 rounded-lg border border-border bg-background p-5", className)}>
      <ChatMarkdown content={content} className="max-w-[92ch] text-[0.95rem] leading-7 [&_h1]:text-xl [&_h2]:text-lg" />
    </div>
  );
}
