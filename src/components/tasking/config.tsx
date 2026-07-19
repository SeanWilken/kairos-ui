import type { ComponentType } from "react";
import {
  Flame, ArrowUp, ArrowDown, Minus,
  Code2, MessageSquare, Brain, type LucideProps,
} from "lucide-react";
import type { TaskDoc, TaskLinkedApp, TaskPriority, TaskStatus } from "../../types/tasking";

export type TaskPriorityConfig = { label: string; color: string; bg: string; Icon: ComponentType<LucideProps> };
export const TASK_PRIORITY_CONFIG: Record<TaskPriority, TaskPriorityConfig> = {
  critical: { label: "Critical", color: "#f87171", bg: "rgba(248,113,113,0.15)", Icon: Flame },
  high:     { label: "High",     color: "#fb923c", bg: "rgba(251,146,60,0.15)",  Icon: ArrowUp },
  medium:   { label: "Medium",   color: "#e8a045", bg: "rgba(232,160,69,0.15)",  Icon: Minus },
  low:      { label: "Low",      color: "#60a5fa", bg: "rgba(96,165,250,0.15)",  Icon: ArrowDown },
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  backlog:       { label: "Backlog",     color: "#6b7194", bg: "rgba(107,113,148,0.15)" },
  todo:          { label: "To Do",       color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
  "in-progress": { label: "In Progress", color: "#8b7cf8", bg: "rgba(139,124,248,0.15)" },
  review:        { label: "Review",      color: "#e8a045", bg: "rgba(232,160,69,0.15)"  },
  done:          { label: "Done",        color: "#4ade80", bg: "rgba(74,222,128,0.15)"  },
};

export const TASK_DOC_TYPE_CONFIG: Record<TaskDoc["type"], { label: string; color: string }> = {
  sop:          { label: "SOP",          color: "#e8a045" },
  faq:          { label: "FAQ",          color: "#60a5fa" },
  requirements: { label: "Req",          color: "#8b7cf8" },
  policy:       { label: "Policy",       color: "#f87171" },
  guidelines:   { label: "Guide",        color: "#4ade80" },
};

export type TaskAppConfig = { label: string; Icon: ComponentType<LucideProps>; color: string };
export const TASK_APP_CONFIG: Record<TaskLinkedApp, TaskAppConfig> = {
  ide:       { label: "Open in IDE",         Icon: Code2,         color: "#60a5fa" },
  council:   { label: "Open in Council",     Icon: MessageSquare, color: "#f472b6" },
  knowledge: { label: "Open in Knowledge",   Icon: Brain,         color: "#4ade80" },
};
