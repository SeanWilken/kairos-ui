import * as React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FileText,
  Lightbulb,
  GitBranch,
  User,
  CheckSquare,
  HelpCircle,
  Shield,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import { type NodeType, type KnowledgeGraphNode as KnowledgeNode } from "../types/knowledge";
import { FederatedSourceBadge } from "./FederatedSourceBadge";
import { cn } from "./ui/utils";

const NODE_TYPE_CONFIG: Record<NodeType, {
  icon: React.ElementType;
  border: string;
  header: string;
  iconColor: string;
}> = {
  document:   { icon: FileText,      border: "border-blue-400",   header: "bg-blue-50 dark:bg-blue-950/40",     iconColor: "text-blue-500" },
  concept:    { icon: Lightbulb,     border: "border-purple-400", header: "bg-purple-50 dark:bg-purple-950/40", iconColor: "text-purple-500" },
  decision:   { icon: GitBranch,     border: "border-amber-400",  header: "bg-amber-50 dark:bg-amber-950/40",   iconColor: "text-amber-500" },
  person:     { icon: User,          border: "border-emerald-400",header: "bg-emerald-50 dark:bg-emerald-950/40",iconColor: "text-emerald-500" },
  action:     { icon: CheckSquare,   border: "border-green-400",  header: "bg-green-50 dark:bg-green-950/40",   iconColor: "text-green-500" },
  question:   { icon: HelpCircle,    border: "border-rose-400",   header: "bg-rose-50 dark:bg-rose-950/40",     iconColor: "text-rose-500" },
  evidence:   { icon: Shield,        border: "border-slate-400",  header: "bg-slate-50 dark:bg-slate-950/40",   iconColor: "text-slate-500" },
  hypothesis: { icon: FlaskConical,  border: "border-cyan-400",   header: "bg-cyan-50 dark:bg-cyan-950/40",     iconColor: "text-cyan-500" },
  index:      { icon: BookOpen,      border: "border-indigo-400", header: "bg-indigo-50 dark:bg-indigo-950/40", iconColor: "text-indigo-500" },
};

export type KnowledgeNodeCardData = KnowledgeNode & {
  onSelect?: (node: KnowledgeNode) => void;
};

export type KnowledgeNodeCardProps = {
  data: KnowledgeNodeCardData;
  selected?: boolean;
};

export function KnowledgeNodeCard({ data, selected }: KnowledgeNodeCardProps) {
  const config = NODE_TYPE_CONFIG[data.type] ?? NODE_TYPE_CONFIG.document;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "w-52 rounded-lg border-2 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-150 cursor-pointer select-none",
        config.border,
        selected && "ring-2 ring-offset-2 ring-primary shadow-md"
      )}
      onClick={() => data.onSelect?.(data)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-muted-foreground/30 !border-muted-foreground/30"
      />

      <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-t-md", config.header)}>
        <Icon size={12} className={config.iconColor} />
        <span className="text-xs font-medium text-muted-foreground capitalize">{data.type}</span>
        {data.confidence !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {Math.round(data.confidence * 100)}%
          </span>
        )}
      </div>

      <div className="px-3 py-2 space-y-1.5">
        <p className="text-sm font-medium leading-snug line-clamp-2">{data.title}</p>
        {data.summary && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{data.summary}</p>
        )}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground"
              >
                {tag.label}
              </span>
            ))}
            {data.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">+{data.tags.length - 2}</span>
            )}
          </div>
        )}
        {data.source && <FederatedSourceBadge source={data.source} compact />}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-muted-foreground/30 !border-muted-foreground/30"
      />
    </div>
  );
}
