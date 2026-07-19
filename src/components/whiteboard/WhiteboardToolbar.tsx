import type { ReactNode } from "react";
import { Eraser, ListTodo, MousePointer2, PenLine, StickyNote, Waypoints } from "lucide-react";
import type { WhiteboardTool } from "../../types/whiteboard";
import { WHITEBOARD_STROKE_COLORS } from "../../types/whiteboard";

const TOOLS: { tool: WhiteboardTool; Icon: typeof PenLine; label: string }[] = [
  { tool: "select", Icon: MousePointer2, label: "Select / move" },
  { tool: "draw", Icon: PenLine, label: "Draw" },
  { tool: "point", Icon: Waypoints, label: "Connect points" },
  { tool: "note", Icon: StickyNote, label: "Add note" },
  { tool: "list", Icon: ListTodo, label: "Add list" },
  { tool: "erase", Icon: Eraser, label: "Erase" },
];

export interface WhiteboardToolbarProps {
  tool: WhiteboardTool;
  strokeColor: string;
  onToolChange: (tool: WhiteboardTool) => void;
  onStrokeColorChange: (color: string) => void;
  colors?: string[];
  endSlot?: ReactNode;
}

/** Tool + color strip for a WhiteboardCanvas. */
export function WhiteboardToolbar({
  tool,
  strokeColor,
  onToolChange,
  onStrokeColorChange,
  colors = WHITEBOARD_STROKE_COLORS,
  endSlot,
}: WhiteboardToolbarProps) {
  return (
    <div className="h-12 flex items-center gap-1 px-4 border-b border-slate-200 bg-white shrink-0">
      {TOOLS.map(({ tool: t, Icon, label }) => (
        <button
          key={t}
          onClick={() => onToolChange(t)}
          title={label}
          className={`p-2 rounded-lg transition-colors ${
            tool === t
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <Icon size={15} />
        </button>
      ))}

      <div className="w-px h-5 bg-slate-200 mx-2" />

      {colors.map((color) => (
        <button
          key={color}
          onClick={() => {
            onStrokeColorChange(color);
            if (tool !== "draw" && tool !== "point") onToolChange("draw");
          }}
          className={`w-5 h-5 rounded-full border-2 transition-transform ${
            strokeColor === color ? "border-indigo-500 scale-110" : "border-white shadow"
          }`}
          style={{ backgroundColor: color }}
          title={`Draw in ${color}`}
        />
      ))}

      <div className="flex-1" />
      {endSlot}
    </div>
  );
}
