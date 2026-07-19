// Whiteboard contract. Boards are addressable, link to each other, and can be
// tagged with the domain they model, so suite apps can discover how a domain's
// features, components, and contracts fit together. Persistence is owned by
// the consuming app (or Core); components in this library are controlled.

export interface WhiteboardStroke {
  id: string;
  points: [number, number][];
  color: string;
  width: number;
}

export type WhiteboardItemKind = "note" | "list";

export interface WhiteboardItem {
  id: string;
  kind: WhiteboardItemKind;
  x: number;
  y: number;
  width: number;
  title: string;
  /** note body (unused for lists) */
  text: string;
  /** list entries (unused for notes) */
  items: string[];
  color: string;
}

export interface WhiteboardLink {
  id: string;
  targetBoardId: string;
  label?: string;
}

export interface WhiteboardData {
  id: string;
  name: string;
  domain?: string;
  strokes: WhiteboardStroke[];
  items: WhiteboardItem[];
  links: WhiteboardLink[];
  createdAt: string;
  updatedAt: string;
}

export type WhiteboardTool = "select" | "draw" | "point" | "note" | "list" | "erase";

export const WHITEBOARD_STROKE_COLORS = ["#1e293b", "#6366f1", "#10b981", "#e8a045", "#f87171"];
export const WHITEBOARD_ITEM_COLORS = ["#fef3c7", "#e0e7ff", "#d1fae5", "#fce7f3", "#f1f5f9"];
