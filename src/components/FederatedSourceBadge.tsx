import * as React from "react";
import { Globe, Database, FileText, Link2, Pencil } from "lucide-react";
import { type FederatedSource, type FederatedSourceType } from "../types/knowledge";
import { cn } from "./ui/utils";

const SOURCE_CONFIG: Record<FederatedSourceType, { icon: React.ElementType; label: string; color: string }> = {
  api: { icon: Globe, label: "API", color: "text-blue-500" },
  database: { icon: Database, label: "DB", color: "text-purple-500" },
  file: { icon: FileText, label: "File", color: "text-amber-500" },
  web: { icon: Link2, label: "Web", color: "text-emerald-500" },
  manual: { icon: Pencil, label: "Manual", color: "text-slate-500" },
};

export type FederatedSourceBadgeProps = {
  source: FederatedSource;
  compact?: boolean;
  className?: string;
};

export function FederatedSourceBadge({ source, compact = false, className }: FederatedSourceBadgeProps) {
  const config = SOURCE_CONFIG[source.type];
  const Icon = config.icon;
  const displayName = compact && source.name.length > 12 ? source.name.slice(0, 12) + "…" : source.name;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded text-xs text-muted-foreground",
        compact
          ? "px-1.5 py-0.5 bg-muted"
          : "px-2 py-1 bg-muted border border-border",
        className
      )}
      title={source.syncedAt ? `${source.name} · Synced ${source.syncedAt}` : source.name}
    >
      <Icon size={11} className={config.color} />
      <span>{displayName}</span>
    </span>
  );
}
