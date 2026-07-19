import * as React from "react";
import {
  FileText, Lightbulb, GitBranch, User, CheckSquare,
  HelpCircle, Shield, FlaskConical, BookOpen,
  Search, ChevronDown, ChevronRight, Globe, Database, Link2, Pencil,
} from "lucide-react";
import {
  type KnowledgeGraphNode as KnowledgeNode,
  type NodeType,
  type FederatedSource,
  type KnowledgeTag,
} from "../types/knowledge";
import { cn } from "./ui/utils";

const NODE_TYPE_CONFIG: Record<NodeType, { icon: React.ElementType; label: string; color: string }> = {
  document:   { icon: FileText,     label: "Documents",   color: "text-blue-500" },
  concept:    { icon: Lightbulb,    label: "Concepts",    color: "text-purple-500" },
  decision:   { icon: GitBranch,    label: "Decisions",   color: "text-amber-500" },
  person:     { icon: User,         label: "People",      color: "text-emerald-500" },
  action:     { icon: CheckSquare,  label: "Actions",     color: "text-green-500" },
  question:   { icon: HelpCircle,   label: "Questions",   color: "text-rose-500" },
  evidence:   { icon: Shield,       label: "Evidence",    color: "text-slate-500" },
  hypothesis: { icon: FlaskConical, label: "Hypotheses",  color: "text-cyan-500" },
  index:      { icon: BookOpen,     label: "Indexes",     color: "text-indigo-500" },
};

const SOURCE_ICONS: Record<string, React.ElementType> = {
  api: Globe, database: Database, web: Link2, manual: Pencil, file: FileText,
};

export type KnowledgeIndexPanelProps = {
  nodes: KnowledgeNode[];
  selectedNodeId?: string;
  onNodeSelect?: (node: KnowledgeNode) => void;
  className?: string;
};

export function KnowledgeIndexPanel({
  nodes,
  selectedNodeId,
  onNodeSelect,
  className,
}: KnowledgeIndexPanelProps) {
  const [search, setSearch] = React.useState("");
  const [expandedTypes, setExpandedTypes] = React.useState<Set<NodeType>>(new Set());
  const [activeTagFilter, setActiveTagFilter] = React.useState<string | null>(null);
  const [activeSourceFilter, setActiveSourceFilter] = React.useState<string | null>(null);

  const filteredNodes = React.useMemo(() => {
    let result = nodes;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary?.toLowerCase().includes(q) ||
          n.tags.some((t) => t.label.toLowerCase().includes(q))
      );
    }
    if (activeTagFilter) {
      result = result.filter((n) => n.tags.some((t) => t.id === activeTagFilter));
    }
    if (activeSourceFilter) {
      result = result.filter((n) => n.source?.id === activeSourceFilter);
    }
    return result;
  }, [nodes, search, activeTagFilter, activeSourceFilter]);

  const groupedByType = React.useMemo(() => {
    const groups = new Map<NodeType, KnowledgeNode[]>();
    filteredNodes.forEach((n) => {
      if (!groups.has(n.type)) groups.set(n.type, []);
      groups.get(n.type)!.push(n);
    });
    return groups;
  }, [filteredNodes]);

  const allTags = React.useMemo(() => {
    const tagMap = new Map<string, KnowledgeTag>();
    nodes.forEach((n) => n.tags.forEach((t) => tagMap.set(t.id, t)));
    return [...tagMap.values()];
  }, [nodes]);

  const allSources = React.useMemo(() => {
    const srcMap = new Map<string, FederatedSource>();
    nodes.forEach((n) => { if (n.source) srcMap.set(n.source.id, n.source); });
    return [...srcMap.values()];
  }, [nodes]);

  const toggleType = (type: NodeType) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  React.useEffect(() => {
    const typesWithNodes = new Set<NodeType>([...groupedByType.keys()]);
    setExpandedTypes(typesWithNodes);
  }, []);

  return (
    <div className={cn("flex flex-col h-full bg-background border-r border-border", className)}>
      <div className="px-3 py-3 border-b border-border shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes…"
            className="w-full pl-8 pr-3 h-8 text-xs rounded-md border border-border bg-background outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {allTags.length > 0 && (
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Tags</p>
            <div className="flex flex-wrap gap-1">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setActiveTagFilter(activeTagFilter === tag.id ? null : tag.id)}
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs border transition-colors",
                    activeTagFilter === tag.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:border-muted-foreground"
                  )}
                  style={
                    tag.color && activeTagFilter !== tag.id
                      ? { borderColor: tag.color, color: tag.color }
                      : undefined
                  }
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {allSources.length > 0 && (
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Sources</p>
            <div className="flex flex-wrap gap-1">
              {allSources.map((src) => {
                const SrcIcon = SOURCE_ICONS[src.type] ?? Globe;
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setActiveSourceFilter(activeSourceFilter === src.id ? null : src.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border transition-colors",
                      activeSourceFilter === src.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:border-muted-foreground"
                    )}
                  >
                    <SrcIcon size={10} />
                    {src.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="py-1">
          {[...groupedByType.entries()].map(([type, typeNodes]) => {
            const config = NODE_TYPE_CONFIG[type];
            const Icon = config.icon;
            const isExpanded = expandedTypes.has(type);

            return (
              <div key={type}>
                <button
                  type="button"
                  onClick={() => toggleType(type)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  {isExpanded ? <ChevronDown size={13} className="text-muted-foreground" /> : <ChevronRight size={13} className="text-muted-foreground" />}
                  <Icon size={13} className={config.color} />
                  <span className="text-xs font-medium">{config.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">{typeNodes.length}</span>
                </button>

                {isExpanded && (
                  <div className="pb-1">
                    {typeNodes.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => onNodeSelect?.(node)}
                        className={cn(
                          "flex items-start gap-2 w-full px-3 py-1.5 pl-9 text-left transition-colors hover:bg-muted/50",
                          selectedNodeId === node.id && "bg-primary/5 text-primary"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">{node.title}</p>
                          {node.tags.length > 0 && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {node.tags.map((t) => t.label).join(", ")}
                            </p>
                          )}
                        </div>
                        {node.source && (
                          <span className="shrink-0 text-xs text-muted-foreground uppercase font-medium">
                            {node.source.type.slice(0, 2)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredNodes.length === 0 && (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-muted-foreground">No nodes match your search.</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-2 border-t border-border shrink-0">
        <p className="text-xs text-muted-foreground tabular-nums">
          {filteredNodes.length} of {nodes.length} nodes
        </p>
      </div>
    </div>
  );
}
