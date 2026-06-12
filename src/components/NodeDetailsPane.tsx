import * as React from "react";
import { Expand, FileText, Info, Tag } from "lucide-react";

import type { KnowledgeNode } from "../types";
import { DocumentViewer } from "./DocumentViewer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "./ui/utils";

export type NodeDetailsPaneProps = {
  node?: KnowledgeNode | null;
  className?: string;
  selectedDocumentId?: string | null;
  onSelectedDocumentChange?: (documentId: string) => void;
};

export function NodeDetailsPane({
  node,
  className,
  selectedDocumentId,
  onSelectedDocumentChange,
}: NodeDetailsPaneProps) {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const documents = node?.relatedDocuments ?? [];
  const fallbackDocumentId = documents[0]?.id ?? null;
  const activeDocumentId = selectedDocumentId ?? fallbackDocumentId;
  const activeDocument = documents.find((document) => document.id === activeDocumentId) ?? documents[0] ?? null;
  const tags = node?.metadata?.tags ?? node?.tags ?? [];

  React.useEffect(() => {
    if (!node) {
      setIsPreviewOpen(false);
      setIsExpanded(false);
    }
  }, [node]);

  if (!node) {
    return (
      <div className={cn("flex h-full min-h-[28rem] items-center justify-center rounded-xl border border-dashed border-border bg-background p-6", className)}>
        <div className="max-w-sm text-center">
          <h3 className="mb-2 text-sm font-medium">No node selected</h3>
          <p className="text-sm text-muted-foreground">Select a node in the map to inspect its tags, metadata, and attached documents.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-4 rounded-xl border border-border bg-background p-4", className)}>
        <div>
          <h3 className="text-base font-semibold">{node.title ?? "Untitled node"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{node.content}</p>
        </div>

        <div className="rounded-lg border border-border p-3">
          <div className="mb-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            Metadata
          </div>
          <div className="space-y-2 text-sm">
            {node.metadata?.sourceType ? <p><span className="text-muted-foreground">Type:</span> {node.metadata.sourceType}</p> : null}
            {node.metadata?.accessLevel ? <p><span className="text-muted-foreground">Access:</span> {node.metadata.accessLevel}</p> : null}
            {node.metadata?.sensitivity ? <p><span className="text-muted-foreground">Sensitivity:</span> {node.metadata.sensitivity}</p> : null}
            <p><span className="text-muted-foreground">Attached documents:</span> {documents.length}</p>
          </div>
        </div>

        {tags.length > 0 ? (
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={`${node.id}-${tag}`} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border border-border p-3">
          <div className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            Documents
          </div>
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No related documents attached.</p>
            ) : (
              documents.map((document) => (
                <div
                  key={document.id}
                  className={cn(
                    "rounded-lg border p-3 transition-colors",
                    activeDocument?.id === document.id ? "border-primary bg-accent/20" : "border-border",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{document.title ?? document.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{document.kind.toUpperCase()}</div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onSelectedDocumentChange?.(document.id);
                        setIsPreviewOpen(true);
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                  {document.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {document.tags.slice(0, 3).map((tag) => (
                        <Badge key={`${document.id}-${tag}`} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen && Boolean(activeDocument)} onOpenChange={(open) => {
        setIsPreviewOpen(open);
        if (!open) {
          setIsExpanded(false);
        }
      }}>
        <DialogContent className={cn("gap-0 p-0", isExpanded ? "max-w-[92vw]" : "max-w-5xl")}>
          {activeDocument ? (
            <>
              <DialogHeader className="border-b border-border px-6 py-4">
                <div className="flex items-start justify-between gap-4 pr-10">
                  <div className="min-w-0 text-left">
                    <DialogTitle>{activeDocument.title ?? activeDocument.name}</DialogTitle>
                    <DialogDescription>
                      {activeDocument.kind.toUpperCase()} preview for {node.title ?? "selected node"}
                    </DialogDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsExpanded((current) => !current)}>
                    <Expand className="mr-2 h-4 w-4" />
                    {isExpanded ? "Standard view" : "Larger view"}
                  </Button>
                </div>
              </DialogHeader>

              <div className={cn("grid min-h-0 gap-0", isExpanded ? "lg:grid-cols-[320px_minmax(0,1fr)]" : "lg:grid-cols-[280px_minmax(0,1fr)]")}>
                <div className="border-b border-border p-4 lg:border-r lg:border-b-0">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    Document metadata
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Node:</span> {node.title ?? "Untitled node"}</p>
                    <p><span className="text-muted-foreground">Kind:</span> {activeDocument.kind}</p>
                    {activeDocument.sourceSystem ? <p><span className="text-muted-foreground">Source:</span> {activeDocument.sourceSystem}</p> : null}
                    {activeDocument.updatedAt ? <p><span className="text-muted-foreground">Updated:</span> {activeDocument.updatedAt}</p> : null}
                  </div>
                  {activeDocument.tags?.length ? (
                    <div className="mt-4">
                      <div className="mb-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <Tag className="h-3.5 w-3.5" />
                        Tags
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeDocument.tags.map((tag) => (
                          <Badge key={`${activeDocument.id}-${tag}`} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className={cn("min-h-0 overflow-auto p-4", isExpanded ? "max-h-[85vh]" : "max-h-[72vh]")}>
                  <DocumentViewer document={activeDocument} />
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NodeDetailsPane;
