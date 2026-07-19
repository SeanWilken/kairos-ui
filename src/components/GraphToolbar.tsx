import * as React from "react";
import { useReactFlow } from "@xyflow/react";
import { ZoomIn, ZoomOut, Maximize2, Shuffle, Filter, Plus } from "lucide-react";
import { type NodeType, type NodeFilterType } from "../types/knowledge";
import { cn } from "./ui/utils";

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  document:   "Documents",
  concept:    "Concepts",
  decision:   "Decisions",
  person:     "People",
  action:     "Actions",
  question:   "Questions",
  evidence:   "Evidence",
  hypothesis: "Hypotheses",
  index:      "Indexes",
};

export type GraphToolbarProps = {
  onAutoLayout?: () => void;
  onAddNode?: () => void;
  activeFilter?: NodeFilterType;
  onFilterChange?: (filter: NodeFilterType) => void;
  availableTypes?: NodeType[];
  className?: string;
};

export function GraphToolbar({
  onAutoLayout,
  onAddNode,
  activeFilter = "all",
  onFilterChange,
  availableTypes = [],
  className,
}: GraphToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center rounded-md border border-border bg-background/90 backdrop-blur-sm shadow-sm">
        <ToolbarBtn onClick={() => zoomIn()} title="Zoom in" aria-label="Zoom in">
          <ZoomIn size={14} />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border" />
        <ToolbarBtn onClick={() => zoomOut()} title="Zoom out" aria-label="Zoom out">
          <ZoomOut size={14} />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border" />
        <ToolbarBtn onClick={() => fitView({ padding: 0.12, duration: 300 })} title="Fit view" aria-label="Fit view">
          <Maximize2 size={14} />
        </ToolbarBtn>
      </div>

      {onAutoLayout && (
        <div className="flex items-center rounded-md border border-border bg-background/90 backdrop-blur-sm shadow-sm">
          <ToolbarBtn onClick={onAutoLayout} title="Auto-arrange nodes" aria-label="Auto-arrange">
            <Shuffle size={14} />
            <span className="ml-1 text-xs">Layout</span>
          </ToolbarBtn>
        </div>
      )}

      {onFilterChange && availableTypes.length > 0 && (
        <div className="relative" ref={filterRef}>
          <div className="flex items-center rounded-md border border-border bg-background/90 backdrop-blur-sm shadow-sm">
            <ToolbarBtn
              onClick={() => setFilterOpen((o) => !o)}
              title="Filter by node type"
              aria-label="Filter"
              active={activeFilter !== "all"}
            >
              <Filter size={14} />
              <span className="ml-1 text-xs">
                {activeFilter === "all" ? "All types" : NODE_TYPE_LABELS[activeFilter as NodeType]}
              </span>
            </ToolbarBtn>
          </div>
          {filterOpen && (
            <div className="absolute top-full mt-1.5 left-0 z-50 w-44 rounded-md border border-border bg-background shadow-md py-1">
              <FilterItem
                label="All types"
                active={activeFilter === "all"}
                onClick={() => { onFilterChange("all"); setFilterOpen(false); }}
              />
              <div className="my-1 border-t border-border" />
              {availableTypes.map((type) => (
                <FilterItem
                  key={type}
                  label={NODE_TYPE_LABELS[type]}
                  active={activeFilter === type}
                  onClick={() => { onFilterChange(type); setFilterOpen(false); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {onAddNode && (
        <button
          type="button"
          onClick={onAddNode}
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={13} />
          Add Node
        </button>
      )}
    </div>
  );
}

function ToolbarBtn({
  children,
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center h-8 px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors first:rounded-l-md last:rounded-r-md",
        active && "text-primary bg-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function FilterItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors",
        active && "text-primary font-medium bg-primary/5"
      )}
    >
      {label}
    </button>
  );
}
