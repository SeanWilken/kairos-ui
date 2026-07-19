import { useRef } from "react";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import type { TaskItem, TeamMember } from "../../types/tasking";
import { TASK_PRIORITY_CONFIG } from "./config";
import { MemberAvatar, TagChip } from "./atoms";

export interface TaskKanbanCardProps {
  task: TaskItem;
  member?: TeamMember;
  onSelect?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDropTarget?: (target: string) => void;
}

/** Board card with priority, tags, effort, and assignee. */
export function TaskKanbanCard({ task, member, onSelect, onDragStart, onDragEnd, onDropTarget }: TaskKanbanCardProps) {
  const pc = TASK_PRIORITY_CONFIG[task.priority];
  const PIcon = pc.Icon;
  const suppressClickRef = useRef(false);
  const dropTargetRef = useRef(onDropTarget);
  dropTargetRef.current = onDropTarget;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !onDragStart) return;

    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    let dragging = false;

    const cleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      if (!dragging && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) >= 5) {
        dragging = true;
        suppressClickRef.current = true;
        onDragStart();
      }
      if (dragging) moveEvent.preventDefault();
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== pointerId) return;
      cleanup();
      if (!dragging) return;

      const target = document
        .elementFromPoint(upEvent.clientX, upEvent.clientY)
        ?.closest<HTMLElement>("[data-kanban-drop-target]")
        ?.dataset.kanbanDropTarget;
      if (target) dropTargetRef.current?.(target);
      onDragEnd?.();
      window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    };

    const handlePointerCancel = (cancelEvent: PointerEvent) => {
      if (cancelEvent.pointerId !== pointerId) return;
      cleanup();
      if (dragging) onDragEnd?.();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
  };

  return (
    <div
      data-task-id={task.id}
      onPointerDown={handlePointerDown}
      onClick={(event) => {
        if (suppressClickRef.current) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onSelect?.();
      }}
      className="group select-none p-3 rounded-xl bg-[#111420] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.18)] cursor-pointer transition-all hover:shadow-lg hover:shadow-[rgba(0,0,0,0.4)] hover:-translate-y-px"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-[#6b7194]">{task.key}</span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-[rgba(255,255,255,0.07)] rounded">
          <MoreHorizontal size={11} className="text-[#6b7194]" />
        </button>
      </div>
      <p className="text-[11px] text-[#d0d0e0] font-medium leading-snug mb-2.5">{task.title}</p>
      <div className="flex flex-wrap gap-1 mb-2.5">
        {task.tags.slice(0, 2).map(t => <TagChip key={t} label={t} />)}
        {task.tags.length > 2 && <TagChip label={`+${task.tags.length - 2}`} />}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PIcon size={10} style={{ color: pc.color }} />
          {task.comments > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] text-[#6b7194]">
              <MessageSquare size={9} />{task.comments}
            </span>
          )}
          {task.estimate > 0 && <span className="text-[9px] font-mono text-[#6b7194]">{task.estimate}h</span>}
        </div>
        {member && <MemberAvatar member={member} size="xs" />}
      </div>
    </div>
  );
}
