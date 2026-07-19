import * as React from "react";
import {
  PanelLeftClose,
  PanelLeftDashed,
  PanelRightClose,
  PanelRightDashed,
  MessageSquare,
} from "lucide-react";
import {
  type KnowledgeGraphData,
  type KnowledgeGraphNode as KnowledgeNode,
  type NodeRelation,
  type NodeFilterType,
} from "../types/knowledge";
import { KnowledgeGraphCanvas } from "./KnowledgeGraphCanvas";
import { KnowledgeIndexPanel } from "./KnowledgeIndexPanel";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { cn } from "./ui/utils";

export type KnowledgeWorkspaceProps = {
  data: KnowledgeGraphData;

  title?: string;

  selectedNodeId?: string;
  defaultSelectedNodeId?: string;
  onNodeSelect?: (node: KnowledgeNode | null) => void;

  onNodeConnect?: (sourceId: string, targetId: string) => void;
  onAddNode?: () => void;
  onAddTag?: (nodeId: string, label: string) => void;
  onRemoveTag?: (nodeId: string, tagId: string) => void;
  onEditNode?: (node: KnowledgeNode) => void;

  activeFilter?: NodeFilterType;
  defaultActiveFilter?: NodeFilterType;
  onFilterChange?: (filter: NodeFilterType) => void;

  indexPanelOpen?: boolean;
  defaultIndexPanelOpen?: boolean;
  onIndexPanelOpenChange?: (open: boolean) => void;
  indexPanelWidth?: number;

  detailPanelWidth?: number;

  onChatAbout?: (node: KnowledgeNode) => void;
  assistantSlot?: React.ReactNode;

  headerEndSlot?: React.ReactNode;
  className?: string;
};

export function KnowledgeWorkspace({
  data,
  title = "KnowLedger",

  selectedNodeId,
  defaultSelectedNodeId,
  onNodeSelect,

  onNodeConnect,
  onAddNode,
  onAddTag,
  onRemoveTag,
  onEditNode,

  activeFilter,
  defaultActiveFilter = "all",
  onFilterChange,

  indexPanelOpen,
  defaultIndexPanelOpen = true,
  onIndexPanelOpenChange,
  indexPanelWidth = 256,

  detailPanelWidth = 320,

  onChatAbout,
  assistantSlot,

  headerEndSlot,
  className,
}: KnowledgeWorkspaceProps) {
  const [internalSelectedId, setInternalSelectedId] = React.useState<string | undefined>(defaultSelectedNodeId);
  const [internalIndexOpen, setInternalIndexOpen] = React.useState(defaultIndexPanelOpen);
  const [internalFilter, setInternalFilter] = React.useState<NodeFilterType>(defaultActiveFilter);

  const resolvedSelectedId = selectedNodeId ?? internalSelectedId;
  const isIndexOpen = indexPanelOpen ?? internalIndexOpen;
  const resolvedFilter = activeFilter ?? internalFilter;

  const selectedNode = React.useMemo(
    () => data.nodes.find((n) => n.id === resolvedSelectedId) ?? null,
    [data.nodes, resolvedSelectedId]
  );

  const nodeRelations = React.useMemo(
    () => resolvedSelectedId
      ? data.relations.filter(
          (r) => r.sourceId === resolvedSelectedId || r.targetId === resolvedSelectedId
        )
      : [],
    [data.relations, resolvedSelectedId]
  );

  const setIndexOpen = (open: boolean) => {
    if (indexPanelOpen === undefined) setInternalIndexOpen(open);
    onIndexPanelOpenChange?.(open);
  };

  const handleNodeSelect = (node: KnowledgeNode | null) => {
    if (selectedNodeId === undefined) setInternalSelectedId(node?.id);
    onNodeSelect?.(node);
  };

  const handleNavigate = (nodeId: string) => {
    const node = data.nodes.find((n) => n.id === nodeId);
    if (node) handleNodeSelect(node);
  };

  const handleFilterChange = (filter: NodeFilterType) => {
    if (activeFilter === undefined) setInternalFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className={cn("flex flex-col h-full min-h-0 bg-background text-foreground", className)}>
      <div className="h-[52px] shrink-0 flex items-center gap-3 px-4 border-b border-border">
        <button
          type="button"
          onClick={() => setIndexOpen(!isIndexOpen)}
          className="h-8 w-8 inline-flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent transition-colors"
          title={isIndexOpen ? "Hide index" : "Show index"}
          aria-label={isIndexOpen ? "Hide index" : "Show index"}
        >
          {isIndexOpen ? <PanelLeftClose size={15} /> : <PanelLeftDashed size={15} />}
        </button>

        <h2 className="text-sm font-semibold">{title}</h2>

        <div className="ml-auto flex items-center gap-2">
          {headerEndSlot}
          {onChatAbout && !selectedNode && assistantSlot === undefined && (
            <button
              type="button"
              onClick={() => onChatAbout(data.nodes[0])}
              className="h-8 w-8 inline-flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent transition-colors"
              title="Open assistant"
              aria-label="Open assistant"
            >
              <MessageSquare size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {isIndexOpen && (
          <div
            className="shrink-0 min-h-0"
            style={{ width: indexPanelWidth, minWidth: indexPanelWidth, maxWidth: indexPanelWidth }}
          >
            <KnowledgeIndexPanel
              nodes={data.nodes}
              selectedNodeId={resolvedSelectedId}
              onNodeSelect={handleNodeSelect}
              className="h-full"
            />
          </div>
        )}

        {!isIndexOpen && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIndexOpen(true)}
              className="absolute left-0 top-4 z-10 h-9 w-7 bg-background border border-l-0 border-border rounded-r-md inline-flex items-center justify-center hover:bg-accent transition-colors"
              title="Show index"
              aria-label="Show index"
            >
              <PanelLeftDashed size={13} className="text-muted-foreground" />
            </button>
          </div>
        )}

        <div className="flex-1 min-w-0 min-h-0 relative">
          <KnowledgeGraphCanvas
            data={data}
            selectedNodeId={resolvedSelectedId}
            onNodeSelect={handleNodeSelect}
            onNodeConnect={onNodeConnect}
            onAddNode={onAddNode}
            activeFilter={resolvedFilter}
            onFilterChange={handleFilterChange}
            className="h-full w-full"
          />
        </div>

        {selectedNode ? (
          <div
            className="shrink-0 min-h-0"
            style={{ width: detailPanelWidth, minWidth: detailPanelWidth, maxWidth: detailPanelWidth }}
          >
            <NodeDetailPanel
              node={selectedNode}
              relations={nodeRelations}
              allNodes={data.nodes}
              onClose={() => handleNodeSelect(null)}
              onNavigate={handleNavigate}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onChatAbout={onChatAbout}
              onEdit={onEditNode}
              className="h-full"
            />
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => {}}
              className="absolute right-0 top-4 z-10 h-9 w-7 bg-background border border-r-0 border-border rounded-l-md inline-flex items-center justify-center text-muted-foreground/30 cursor-default"
              title="Select a node to view details"
              aria-label="No node selected"
              tabIndex={-1}
            >
              <PanelRightDashed size={13} />
            </button>
          </div>
        )}
      </div>

      {assistantSlot && (
        <div className="absolute bottom-4 right-4 z-20">
          {assistantSlot}
        </div>
      )}
    </div>
  );
}

export type {
  KnowledgeGraphData,
  KnowledgeGraphNode,
  NodeRelation,
  NodeFilterType,
} from "../types/knowledge";
