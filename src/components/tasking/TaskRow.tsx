import { GripVertical } from "lucide-react";
import type { TaskItem, TeamMember } from "../../types/tasking";
import { TASK_PRIORITY_CONFIG, TASK_STATUS_CONFIG } from "./config";
import { MemberAvatar } from "./atoms";

export interface TaskRowProps {
  task: TaskItem;
  member?: TeamMember;
  selected?: boolean;
  onSelect?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/** Compact draggable task line for sidebars and backlogs. */
export function TaskRow({ task, member, selected = false, onSelect, onDragStart, onDragEnd }: TaskRowProps) {
  const pc = TASK_PRIORITY_CONFIG[task.priority];
  const sc = TASK_STATUS_CONFIG[task.status];
  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart?.(); }}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className={`group flex items-start gap-1.5 p-2.5 rounded-lg cursor-pointer transition-colors border ${
        selected
          ? "bg-[rgba(139,124,248,0.1)] border-[rgba(139,124,248,0.3)]"
          : "border-transparent hover:bg-[rgba(255,255,255,0.04)]"
      }`}
    >
      <div className="mt-[3px] opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0">
        <GripVertical size={11} className="text-[#6b7194]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[9px] font-mono text-[#6b7194]">{task.key}</span>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: pc.color }} />
        </div>
        <p className={`text-[11px] leading-snug ${task.status === "done" ? "line-through text-[#6b7194]" : "text-[#d0d0e0]"}`}>
          {task.title}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px]" style={{ color: sc.color }}>{sc.label}</span>
          {member && <MemberAvatar member={member} size="xs" />}
        </div>
      </div>
    </div>
  );
}
