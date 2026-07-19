import { useState, type ReactNode } from "react";
import type { WhiteboardItem, WhiteboardStroke, WhiteboardTool } from "../../types/whiteboard";
import { WHITEBOARD_STROKE_COLORS } from "../../types/whiteboard";
import { WhiteboardCanvas } from "./WhiteboardCanvas";
import { WhiteboardToolbar } from "./WhiteboardToolbar";

export interface WhiteboardSurfaceProps {
  strokes: WhiteboardStroke[];
  items: WhiteboardItem[];
  onAddStroke?: (stroke: Omit<WhiteboardStroke, "id">) => void;
  onRemoveStroke?: (strokeId: string) => void;
  onAddItem?: (item: Omit<WhiteboardItem, "id">) => void;
  onUpdateItem?: (itemId: string, updates: Partial<WhiteboardItem>) => void;
  onRemoveItem?: (itemId: string) => void;
  defaultTool?: WhiteboardTool;
  toolbarEndSlot?: ReactNode;
  className?: string;
}

/**
 * Toolbar + canvas in one drop-in surface. Tool and color selection are
 * managed internally; board data stays controlled by the caller.
 */
export function WhiteboardSurface({
  strokes,
  items,
  onAddStroke,
  onRemoveStroke,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  defaultTool = "select",
  toolbarEndSlot,
  className,
}: WhiteboardSurfaceProps) {
  const [tool, setTool] = useState<WhiteboardTool>(defaultTool);
  const [strokeColor, setStrokeColor] = useState(WHITEBOARD_STROKE_COLORS[0]);

  return (
    <div className={`flex flex-col size-full min-h-0 ${className ?? ""}`}>
      <WhiteboardToolbar
        tool={tool}
        strokeColor={strokeColor}
        onToolChange={setTool}
        onStrokeColorChange={setStrokeColor}
        endSlot={toolbarEndSlot}
      />
      <div className="flex-1 min-h-0">
        <WhiteboardCanvas
          strokes={strokes}
          items={items}
          tool={tool}
          strokeColor={strokeColor}
          onAddStroke={onAddStroke}
          onRemoveStroke={onRemoveStroke}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          onToolChange={setTool}
        />
      </div>
    </div>
  );
}
