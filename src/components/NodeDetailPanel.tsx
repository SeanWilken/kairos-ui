import * as React from "react";
import {
  FileText, Lightbulb, GitBranch, User, CheckSquare,
  HelpCircle, Shield, FlaskConical, BookOpen,
  ArrowRight, ArrowLeft, X, ExternalLink, MessageSquare, Edit2,
  ChevronDown, ChevronRight,
} from "lucide-react";
import { type KnowledgeGraphNode as KnowledgeNode, type NodeRelation, type NodeType, type RelationType } from "../types/knowledge";
import { FederatedSourceBadge } from "./FederatedSourceBadge";
import { TagEditor } from "./TagEditor";
import { RELATION_STYLE_MAP } from "./RelationEdge";
import { cn } from "./ui/utils";

const NODE_TYPE_ICONS: Record<NodeType, React.ElementType> = {
  document:   FileText,
  concept:    Lightbulb,
  decision:   GitBranch,
  person:     User,
  action:     CheckSquare,
  question:   HelpCircle,
  evidence:   Shield,
  hypothesis: FlaskConical,
  index:      BookOpen,
};

const NODE_TYPE_COLORS: Record<NodeType, string> = {
  document:   "text-blue-500",
  concept:    "text-purple-500",
  decision:   "text-amber-500",
  person:     "text-emerald-500",
  action:     "text-green-500",
  question:   "text-rose-500",
  evidence:   "text-slate-500",
  hypothesis: "text-cyan-500",
  index:      "text-indigo-500",
};

type RelationGroup = {
  type: RelationType;
  outgoing: (NodeRelation & { node: KnowledgeNode })[];
  incoming: (NodeRelation & { node: KnowledgeNode })[];
};

function groupRelations(
  nodeId: string,
  relations: NodeRelation[],
  nodeMap: Map<string, KnowledgeNode>
): RelationGroup[] {
  const groups = new Map<RelationType, RelationGroup>();

  relations.forEach((rel) => {
    const isOut = rel.sourceId === nodeId;
    const isIn = rel.targetId === nodeId;
    if (!isOut && !isIn) return;

    const peerId = isOut ? rel.targetId : rel.sourceId;
    const peer = nodeMap.get(peerId);
    if (!peer) return;

    if (!groups.has(rel.type)) {
      groups.set(rel.type, { type: rel.type, outgoing: [], incoming: [] });
    }
    const group = groups.get(rel.type)!;
    if (isOut) group.outgoing.push({ ...rel, node: peer });
    else group.incoming.push({ ...rel, node: peer });
  });

  return [...groups.values()];
}

export type NodeDetailPanelProps = {
  node: KnowledgeNode;
  relations?: NodeRelation[];
  allNodes?: KnowledgeNode[];
  onClose?: () => void;
  onNavigate?: (nodeId: string) => void;
  onAddTag?: (nodeId: string, label: string) => void;
  onRemoveTag?: (nodeId: string, tagId: string) => void;
  onChatAbout?: (node: KnowledgeNode) => void;
  onEdit?: (node: KnowledgeNode) => void;
  className?: string;
};

export function NodeDetailPanel({
  node,
  relations = [],
  allNodes = [],
  onClose,
  onNavigate,
  onAddTag,
  onRemoveTag,
  onChatAbout,
  onEdit,
  className,
}: NodeDetailPanelProps) {
  const [relationsExpanded, setRelationsExpanded] = React.useState(true);
  const [metaExpanded, setMetaExpanded] = React.useState(false);

  const nodeMap = React.useMemo(
    () => new Map(allNodes.map((n) => [n.id, n])),
    [allNodes]
  );

  const relationGroups = React.useMemo(
    () => groupRelations(node.id, relations, nodeMap),
    [node.id, relations, nodeMap]
  );

  const Icon = NODE_TYPE_ICONS[node.type] ?? FileText;
  const iconColor = NODE_TYPE_COLORS[node.type] ?? "text-muted-foreground";
  const totalRelations = relationGroups.reduce(
    (acc, g) => acc + g.outgoing.length + g.incoming.length,
    0
  );

  return (
    <div className={cn("flex flex-col h-full bg-background border-l border-border", className)}>
      <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={16} className={iconColor} />
          <span className="text-xs font-medium text-muted-foreground capitalize">{node.type}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(node)}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Edit node"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onChatAbout && (
            <button
              type="button"
              onClick={() => onChatAbout(node)}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Chat about this node"
            >
              <MessageSquare size={13} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Close"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 py-3 space-y-4">
          <div>
            <h3 className="font-semibold leading-snug">{node.title}</h3>
            {node.confidence !== undefined && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${Math.round(node.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {Math.round(node.confidence * 100)}% confidence
                </span>
              </div>
            )}
          </div>

          {node.source && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Source</span>
              <FederatedSourceBadge source={node.source} />
              {node.source.url && (
                <a
                  href={node.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}

          {node.summary && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">{node.summary}</p>
            </div>
          )}

          {node.content && (
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{node.content}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Tags</p>
            <TagEditor
              tags={node.tags}
              onAddTag={onAddTag ? (label) => onAddTag(node.id, label) : undefined}
              onRemoveTag={onRemoveTag ? (tagId) => onRemoveTag(node.id, tagId) : undefined}
              readOnly={!onAddTag}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setRelationsExpanded((v) => !v)}
              className="flex items-center gap-1.5 w-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {relationsExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              Relations
              <span className="ml-auto tabular-nums">{totalRelations}</span>
            </button>

            {relationsExpanded && (
              <div className="mt-2 space-y-3">
                {relationGroups.length === 0 && (
                  <p className="text-xs text-muted-foreground pl-1">No relations yet.</p>
                )}
                {relationGroups.map((group) => {
                  const style = RELATION_STYLE_MAP[group.type];
                  return (
                    <div key={group.type}>
                      <p className="text-xs font-medium mb-1" style={{ color: style.stroke }}>
                        {style.displayLabel}
                      </p>
                      <div className="space-y-1 pl-2">
                        {group.outgoing.map((rel) => (
                          <RelationRow
                            key={rel.id}
                            node={rel.node}
                            direction="out"
                            onNavigate={onNavigate}
                          />
                        ))}
                        {group.incoming.map((rel) => (
                          <RelationRow
                            key={rel.id}
                            node={rel.node}
                            direction="in"
                            onNavigate={onNavigate}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {node.metadata && Object.keys(node.metadata).length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setMetaExpanded((v) => !v)}
                className="flex items-center gap-1.5 w-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {metaExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                Metadata
              </button>
              {metaExpanded && (
                <div className="mt-2 rounded-md border border-border bg-muted/30 px-3 py-2 space-y-1">
                  {Object.entries(node.metadata).map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-xs">
                      <span className="text-muted-foreground shrink-0">{k}</span>
                      <span className="font-mono truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border shrink-0 space-y-1">
        <p className="text-xs text-muted-foreground">
          Created {new Date(node.createdAt).toLocaleDateString()}
          {node.updatedAt && ` · Updated ${new Date(node.updatedAt).toLocaleDateString()}`}
        </p>
      </div>
    </div>
  );
}

function RelationRow({
  node,
  direction,
  onNavigate,
}: {
  node: KnowledgeNode;
  direction: "in" | "out";
  onNavigate?: (nodeId: string) => void;
}) {
  const Icon = NODE_TYPE_ICONS[node.type] ?? FileText;
  const iconColor = NODE_TYPE_COLORS[node.type] ?? "text-muted-foreground";

  return (
    <button
      type="button"
      onClick={() => onNavigate?.(node.id)}
      className="flex items-center gap-2 w-full rounded px-1.5 py-1 hover:bg-muted transition-colors text-left"
    >
      {direction === "in" ? (
        <ArrowLeft size={11} className="text-muted-foreground shrink-0" />
      ) : (
        <ArrowRight size={11} className="text-muted-foreground shrink-0" />
      )}
      <Icon size={12} className={cn(iconColor, "shrink-0")} />
      <span className="text-xs truncate">{node.title}</span>
    </button>
  );
}
