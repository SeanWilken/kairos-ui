import { useEffect, useReducer, useRef, useState } from "react";
import { GripHorizontal, Plus, Trash2 } from "lucide-react";
import type { WhiteboardItem, WhiteboardStroke, WhiteboardTool } from "../../types/whiteboard";
import { WHITEBOARD_ITEM_COLORS } from "../../types/whiteboard";

export interface WhiteboardCanvasProps {
  strokes: WhiteboardStroke[];
  items: WhiteboardItem[];
  tool: WhiteboardTool;
  strokeColor: string;
  onAddStroke?: (stroke: Omit<WhiteboardStroke, "id">) => void;
  onRemoveStroke?: (strokeId: string) => void;
  onAddItem?: (item: Omit<WhiteboardItem, "id">) => void;
  onUpdateItem?: (itemId: string, updates: Partial<WhiteboardItem>) => void;
  onRemoveItem?: (itemId: string) => void;
  /** Requested after placing a note/list so callers can flip back to select. */
  onToolChange?: (tool: WhiteboardTool) => void;
  className?: string;
}

/**
 * Freehand drawing canvas with draggable notes and editable lists. Fully
 * controlled: the caller owns board state and applies every mutation.
 */
export function WhiteboardCanvas({
  strokes,
  items,
  tool,
  strokeColor,
  onAddStroke,
  onRemoveStroke,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onToolChange,
  className,
}: WhiteboardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Draft stroke lives in a ref so no pointermove is lost between renders;
  // the reducer only forces a repaint of the in-progress path.
  const draftRef = useRef<[number, number][] | null>(null);
  const drawingPointerRef = useRef<number | null>(null);
  const pointAnchorRef = useRef<[number, number] | null>(null);
  const pointPreviewRef = useRef<[number, number] | null>(null);
  const [, repaint] = useReducer((c: number) => c + 1, 0);

  useEffect(() => {
    if (tool !== "point" && pointAnchorRef.current) {
      pointAnchorRef.current = null;
      pointPreviewRef.current = null;
      repaint();
    }
  }, [tool]);

  const toLocal = (e: React.PointerEvent): [number, number] => {
    const rect = containerRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const point = toLocal(e);

    if (tool === "draw") {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      drawingPointerRef.current = e.pointerId;
      draftRef.current = [point];
      repaint();
    } else if (tool === "point") {
      const anchor = pointAnchorRef.current;
      if (anchor) {
        onAddStroke?.({ points: [anchor, point], color: strokeColor, width: 2.5 });
      }
      pointAnchorRef.current = point;
      pointPreviewRef.current = point;
      repaint();
    } else if (tool === "note" || tool === "list") {
      onAddItem?.({
        kind: tool,
        x: point[0],
        y: point[1],
        width: tool === "note" ? 240 : 220,
        title: tool === "note" ? "Note" : "List",
        text: "",
        items: [],
        color: WHITEBOARD_ITEM_COLORS[tool === "note" ? 0 : 1],
      });
      onToolChange?.("select");
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draftRef.current && drawingPointerRef.current === e.pointerId) {
      e.preventDefault();
      draftRef.current.push(toLocal(e));
      repaint();
    } else if (tool === "point" && pointAnchorRef.current) {
      pointPreviewRef.current = toLocal(e);
      repaint();
    }
  };

  const finishStroke = (e: React.PointerEvent) => {
    if (drawingPointerRef.current !== e.pointerId) return;

    const draft = draftRef.current;
    draftRef.current = null;
    drawingPointerRef.current = null;
    if (draft && draft.length > 1) {
      onAddStroke?.({ points: draft, color: strokeColor, width: 2.5 });
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    repaint();
  };

  const cancelStroke = (e: React.PointerEvent) => {
    if (drawingPointerRef.current !== e.pointerId) return;
    draftRef.current = null;
    drawingPointerRef.current = null;
    repaint();
  };

  const handlePointerLeave = () => {
    if (tool === "point" && pointPreviewRef.current) {
      pointPreviewRef.current = null;
      repaint();
    }
  };

  const toPath = (points: [number, number][]) =>
    points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const canvasCursor =
    tool === "draw" || tool === "point" || tool === "erase" ? "crosshair" : tool === "select" ? "default" : "copy";

  return (
    <div
      ref={containerRef}
      className={`relative size-full overflow-hidden bg-white ${className ?? ""}`}
      style={{
        cursor: canvasCursor,
        touchAction: "none",
        backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishStroke}
      onPointerCancel={cancelStroke}
      onPointerLeave={handlePointerLeave}
    >
      {/* Ink layer */}
      <svg className="absolute inset-0 size-full">
        {strokes.map((stroke) => (
          <path
            key={stroke.id}
            d={toPath(stroke.points)}
            fill="none"
            stroke={stroke.color}
            strokeWidth={stroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: tool === "erase" ? "stroke" : "none", cursor: "pointer" }}
            onPointerDown={(e) => {
              if (tool === "erase") {
                e.stopPropagation();
                onRemoveStroke?.(stroke.id);
              }
            }}
          />
        ))}
        {draftRef.current && (
          <path
            d={toPath(draftRef.current)}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: "none" }}
          />
        )}
        {pointAnchorRef.current && pointPreviewRef.current && (
          <path
            d={toPath([pointAnchorRef.current, pointPreviewRef.current])}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="5 4"
            opacity={0.65}
            style={{ pointerEvents: "none" }}
          />
        )}
        {pointAnchorRef.current && (
          <circle
            cx={pointAnchorRef.current[0]}
            cy={pointAnchorRef.current[1]}
            r={4}
            fill={strokeColor}
            stroke="white"
            strokeWidth={1.5}
            style={{ pointerEvents: "none" }}
          />
        )}
      </svg>

      {/* Items layer — inert for ink tools so strokes can pass over the cards. */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: tool === "draw" || tool === "point" || tool === "erase" ? "none" : undefined }}
      >
        {items.map((item) => (
          <WhiteboardItemCard
            key={item.id}
            item={item}
            tool={tool}
            containerRef={containerRef}
            onUpdateItem={onUpdateItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
}

function WhiteboardItemCard({ item, tool, containerRef, onUpdateItem, onRemoveItem }: {
  item: WhiteboardItem;
  tool: WhiteboardTool;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onUpdateItem?: (itemId: string, updates: Partial<WhiteboardItem>) => void;
  onRemoveItem?: (itemId: string) => void;
}) {
  const [newEntry, setNewEntry] = useState("");

  const startDrag = (e: React.PointerEvent) => {
    if (tool !== "select" || !onUpdateItem) return;
    e.stopPropagation();
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - item.x;
    const offsetY = e.clientY - rect.top - item.y;

    const onMove = (ev: PointerEvent) => {
      onUpdateItem(item.id, {
        x: Math.max(0, ev.clientX - rect.left - offsetX),
        y: Math.max(0, ev.clientY - rect.top - offsetY),
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      className="absolute rounded-xl border border-slate-300 shadow-md group"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        backgroundColor: item.color,
        pointerEvents: tool === "erase" ? "auto" : undefined,
      }}
      onPointerDown={(e) => {
        if (tool === "erase") {
          e.stopPropagation();
          onRemoveItem?.(item.id);
        }
      }}
    >
      {/* Drag handle + actions */}
      <div
        className="flex items-center gap-1 px-2 py-1 border-b border-black/10 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={startDrag}
      >
        <GripHorizontal size={12} className="text-slate-500" />
        <input
          value={item.title}
          onChange={(e) => onUpdateItem?.(item.id, { title: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent text-xs font-semibold text-slate-800 outline-none min-w-0"
        />
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onRemoveItem?.(item.id)}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 transition-all"
          title="Delete"
        >
          <Trash2 size={11} className="text-slate-600" />
        </button>
      </div>

      <div className="p-2" onPointerDown={(e) => tool === "select" && e.stopPropagation()}>
        {item.kind === "note" ? (
          <textarea
            value={item.text}
            onChange={(e) => onUpdateItem?.(item.id, { text: e.target.value })}
            placeholder="Write something…"
            rows={Math.max(2, item.text.split("\n").length)}
            className="w-full bg-transparent text-xs text-slate-700 outline-none resize-none leading-relaxed"
          />
        ) : (
          <div className="space-y-1">
            {item.items.map((entry, i) => (
              <div key={i} className="flex items-start gap-1.5 group/entry">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                <input
                  value={entry}
                  onChange={(e) =>
                    onUpdateItem?.(item.id, {
                      items: item.items.map((it, j) => (j === i ? e.target.value : it)),
                    })
                  }
                  className="flex-1 bg-transparent text-xs text-slate-700 outline-none min-w-0"
                />
                <button
                  onClick={() => onUpdateItem?.(item.id, { items: item.items.filter((_, j) => j !== i) })}
                  className="opacity-0 group-hover/entry:opacity-100 p-0.5 rounded hover:bg-black/10"
                >
                  <Trash2 size={10} className="text-slate-500" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <Plus size={11} className="text-slate-400 flex-shrink-0" />
              <input
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newEntry.trim()) {
                    onUpdateItem?.(item.id, { items: [...item.items, newEntry.trim()] });
                    setNewEntry("");
                  }
                }}
                placeholder="Add item…"
                className="flex-1 bg-transparent text-xs text-slate-500 outline-none min-w-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
