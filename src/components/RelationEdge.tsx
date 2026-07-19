import * as React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  MarkerType,
  type EdgeProps,
} from "@xyflow/react";
import { type RelationType } from "../types/knowledge";
import { cn } from "./ui/utils";

export const RELATION_STYLE_MAP: Record<RelationType, {
  stroke: string;
  dashArray?: string;
  displayLabel: string;
}> = {
  references:   { stroke: "#94a3b8", dashArray: "6 4", displayLabel: "references" },
  contradicts:  { stroke: "#ef4444",                   displayLabel: "contradicts" },
  supports:     { stroke: "#22c55e",                   displayLabel: "supports" },
  extends:      { stroke: "#3b82f6",                   displayLabel: "extends" },
  is_a:         { stroke: "#a855f7", dashArray: "6 4", displayLabel: "is a" },
  part_of:      { stroke: "#8b5cf6",                   displayLabel: "part of" },
  authored_by:  { stroke: "#f97316",                   displayLabel: "authored by" },
  derived_from: { stroke: "#06b6d4", dashArray: "6 4", displayLabel: "derived from" },
  indexed_by:   { stroke: "#64748b", dashArray: "4 4", displayLabel: "indexed by" },
};

export type RelationEdgeData = {
  relationType: RelationType;
  label?: string;
  weight?: number;
  onEdgeClick?: (edgeId: string) => void;
};

export function RelationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps & { data: RelationEdgeData }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const style = RELATION_STYLE_MAP[data.relationType] ?? RELATION_STYLE_MAP.references;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={`url(#${MarkerType.ArrowClosed})`}
        style={{
          stroke: style.stroke,
          strokeWidth: selected ? 2.5 : 1.5,
          strokeDasharray: style.dashArray,
          opacity: selected ? 1 : 0.65,
          transition: "stroke-width 0.15s, opacity 0.15s",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onClick={() => data.onEdgeClick?.(id)}
        >
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-xs bg-white dark:bg-zinc-900 border border-border cursor-pointer",
              "hover:bg-muted transition-colors whitespace-nowrap",
              selected && "ring-1 ring-primary"
            )}
            style={{ color: style.stroke }}
          >
            {data.label ?? style.displayLabel}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
