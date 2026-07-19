import { useState } from "react";
import { Activity, Calendar, CheckCircle2, GitBranch, Layers, Plus, Trash2, Zap } from "lucide-react";
import type { Sprint, TaskItem, TaskStatus, TeamMember } from "../../types/tasking";
import { TASK_STATUS_CONFIG } from "./config";
import { TaskKanbanCard } from "./TaskKanbanCard";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "backlog",       label: "Backlog" },
  { status: "todo",          label: "To Do" },
  { status: "in-progress",   label: "In Progress" },
  { status: "review",        label: "Review" },
  { status: "done",          label: "Done" },
];

export interface TaskKanbanBoardProps {
  /** Tasks to display (pre-filtered to the sprint/scope the caller wants shown). */
  tasks: TaskItem[];
  members?: TeamMember[];
  /** Id of the task currently dragging; when set, drop zones overlay the board. */
  draggingTaskId?: string | null;
  /** Extra sprints offered as drop targets ("move to sprint"). */
  dropSprints?: Sprint[];
  /** Show a delete drop zone (default true when onDrop is provided). */
  allowDelete?: boolean;
  onSelectTask?: (id: string) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  /** Called with a TaskStatus, a sprint id from dropSprints, or "delete". */
  onDrop?: (target: TaskStatus | string) => void;
  onAddTask?: (status: TaskStatus) => void;
}

/**
 * Five-column kanban with a full-board drop overlay: status zones plus
 * optional move-to-sprint and delete zones. Fully controlled — the caller owns
 * task state and applies the drop.
 */
export function TaskKanbanBoard({
  tasks,
  members = [],
  draggingTaskId = null,
  dropSprints = [],
  allowDelete = true,
  onSelectTask,
  onDragStart,
  onDragEnd,
  onDrop,
  onAddTask,
}: TaskKanbanBoardProps) {
  const [over, setOver] = useState<string | null>(null);
  const memberById = (id: string) => members.find((m) => m.id === id);

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
      {/* Board */}
      <div className={`flex-1 overflow-x-auto overflow-y-hidden flex gap-3 px-5 py-5 transition-opacity duration-200 ${draggingTaskId ? "opacity-25 pointer-events-none" : ""}`}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.status).sort((a, b) => a.order - b.order);
          const cfg = TASK_STATUS_CONFIG[col.status];
          return (
            <div key={col.status} data-kanban-column={col.status} className="flex-shrink-0 w-[212px] flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold" style={{ color: cfg.color }}>{col.label}</span>
                  <span className="text-[9px] font-mono bg-[rgba(255,255,255,0.06)] text-[#6b7194] px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                {onAddTask && (
                  <button
                    onClick={() => onAddTask(col.status)}
                    className="p-0.5 hover:bg-[rgba(255,255,255,0.06)] rounded text-[#6b7194] hover:text-[#e8a045] transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                {colTasks.map(t => (
                  <TaskKanbanCard key={t.id} task={t}
                    member={memberById(t.assigneeId)}
                    onSelect={onSelectTask ? () => onSelectTask(t.id) : undefined}
                    onDragStart={onDragStart ? () => onDragStart(t.id) : undefined}
                    onDragEnd={onDragEnd}
                    onDropTarget={onDrop} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag overlay */}
      {draggingTaskId && onDrop && (
        <div className="absolute inset-0 z-20 flex flex-col gap-3 p-5 bg-[rgba(11,13,20,0.85)] backdrop-blur-sm">
          <p className="text-center text-[11px] text-[#6b7194] mb-1">Drop into a destination</p>
          {/* Status zones */}
          <div className="grid grid-cols-5 gap-3 flex-1">
            {COLUMNS.map(col => {
              const cfg = TASK_STATUS_CONFIG[col.status];
              const isOver = over === col.status;
              const CIcon = col.status === "done" ? CheckCircle2 : col.status === "in-progress" ? Activity : col.status === "review" ? Zap : col.status === "todo" ? Calendar : Layers;
              return (
                <div key={col.status}
                  data-kanban-drop-target={col.status}
                  onPointerEnter={() => setOver(col.status)}
                  onPointerLeave={() => setOver(null)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none"
                  style={{
                    borderColor: isOver ? cfg.color : "rgba(255,255,255,0.1)",
                    backgroundColor: isOver ? cfg.color + "18" : "rgba(255,255,255,0.02)",
                    transform: isOver ? "scale(1.02)" : "scale(1)",
                  }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: cfg.color + "22" }}>
                    <CIcon size={18} style={{ color: cfg.color }} />
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: isOver ? cfg.color : "#8890aa" }}>{col.label}</span>
                </div>
              );
            })}
          </div>
          {/* Sprint + delete zones */}
          {(dropSprints.length > 0 || allowDelete) && (
            <div className="grid grid-cols-3 gap-3 h-28">
              {dropSprints.map(s => (
                <div key={s.id}
                  data-kanban-drop-target={s.id}
                  onPointerEnter={() => setOver(s.id)}
                  onPointerLeave={() => setOver(null)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer"
                  style={{
                    borderColor: over === s.id ? "#8b7cf8" : "rgba(255,255,255,0.08)",
                    backgroundColor: over === s.id ? "rgba(139,124,248,0.15)" : "rgba(255,255,255,0.02)",
                    transform: over === s.id ? "scale(1.02)" : "scale(1)",
                  }}>
                  <GitBranch size={16} className="mb-1.5" style={{ color: over === s.id ? "#8b7cf8" : "#6b7194" }} />
                  <span className="text-[10px] font-medium text-center px-3 leading-tight" style={{ color: over === s.id ? "#8b7cf8" : "#6b7194" }}>
                    {s.name.split("—")[0].trim()}
                  </span>
                  <span className="text-[9px] text-center px-2 leading-tight mt-0.5 text-[#4a4e6a]">
                    {s.name.split("—")[1]?.trim()}
                  </span>
                </div>
              ))}
              {allowDelete && (
                <div
                  data-kanban-drop-target="delete"
                  onPointerEnter={() => setOver("delete")}
                  onPointerLeave={() => setOver(null)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer"
                  style={{
                    borderColor: over === "delete" ? "#f87171" : "rgba(255,255,255,0.08)",
                    backgroundColor: over === "delete" ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.02)",
                    transform: over === "delete" ? "scale(1.02)" : "scale(1)",
                  }}>
                  <Trash2 size={16} className="mb-1.5" style={{ color: over === "delete" ? "#f87171" : "#6b7194" }} />
                  <span className="text-[11px] font-medium" style={{ color: over === "delete" ? "#f87171" : "#6b7194" }}>Delete</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
