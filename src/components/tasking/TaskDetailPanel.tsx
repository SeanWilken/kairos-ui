import { Calendar, ExternalLink, MessageSquare, X } from "lucide-react";
import type { TaskDoc, TaskItem, TaskLinkedApp, TaskPriority, TaskStatus, TeamMember } from "../../types/tasking";
import { TASK_APP_CONFIG, TASK_DOC_TYPE_CONFIG, TASK_PRIORITY_CONFIG, TASK_STATUS_CONFIG } from "./config";
import { MemberAvatar, MiniProgressBar, TagChip } from "./atoms";
import { TaskTimer } from "./TaskTimer";

export interface TaskDetailPanelProps {
  task: TaskItem;
  member?: TeamMember;
  /** Documents linked from task.linkedDocs (pass the resolved objects). */
  docs?: TaskDoc[];
  onUpdateTask?: (id: string, updates: Partial<TaskItem>) => void;
  onClose?: () => void;
  /** When provided, the panel includes the session timer. */
  onStartTimer?: (taskId: string) => void;
  onStopTimer?: (taskId: string) => void;
  /** Cross-app deep link (e.g. open this task in myAIDE). */
  onOpenApp?: (app: TaskLinkedApp) => void;
}

/** Full task inspector: status/priority editors, assignee, time, tags, docs, timer. */
export function TaskDetailPanel({
  task,
  member,
  docs = [],
  onUpdateTask,
  onClose,
  onStartTimer,
  onStopTimer,
  onOpenApp,
}: TaskDetailPanelProps) {
  const pct = task.estimate > 0 ? Math.min(100, Math.round(task.logged / task.estimate * 100)) : 0;
  const linkedDocObjs = docs.filter(d => task.linkedDocs.includes(d.id));

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Manrope',sans-serif" }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.07)] flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] font-mono text-[#6b7194] mb-1">{task.key}</p>
          <h3 className="text-[13px] font-semibold text-[#e8e8f2] leading-snug">{task.title}</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-[rgba(255,255,255,0.06)] rounded flex-shrink-0">
            <X size={13} className="text-[#6b7194]" />
          </button>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Status", value: task.status, opts: Object.entries(TASK_STATUS_CONFIG).map(([k,v]) => ({ k, label: v.label })), onChange: (v: string) => onUpdateTask?.(task.id, { status: v as TaskStatus }) },
            { label: "Priority", value: task.priority, opts: Object.entries(TASK_PRIORITY_CONFIG).map(([k,v]) => ({ k, label: v.label })), onChange: (v: string) => onUpdateTask?.(task.id, { priority: v as TaskPriority }) },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[9px] text-[#6b7194] mb-1 font-semibold uppercase tracking-wider">{f.label}</p>
              <select value={f.value} onChange={e => f.onChange(e.target.value)}
                disabled={!onUpdateTask}
                style={{ colorScheme: "dark" }}
                className="w-full text-[11px] bg-[#1a1c2a] border border-[rgba(255,255,255,0.1)] rounded px-2 py-1.5 text-[#e8e8f2] outline-none cursor-pointer disabled:cursor-default">
                {f.opts.map(o => <option key={o.k} value={o.k}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Assignee */}
        {member && (
          <div>
            <p className="text-[9px] text-[#6b7194] mb-1.5 font-semibold uppercase tracking-wider">Assignee</p>
            <div className="flex items-center gap-2">
              <MemberAvatar member={member} size="sm" />
              <div>
                <p className="text-[12px] text-[#e8e8f2] font-medium">{member.name}</p>
                <p className="text-[10px] text-[#6b7194]">{member.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Due date */}
        <div>
          <p className="text-[9px] text-[#6b7194] mb-1.5 font-semibold uppercase tracking-wider">Due Date</p>
          <div className="flex items-center gap-1.5 text-[12px] text-[#e8e8f2]">
            <Calendar size={12} className="text-[#6b7194]" />
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Time tracking */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] text-[#6b7194] font-semibold uppercase tracking-wider">Time Tracking</p>
            <span className="text-[10px] font-mono text-[#6b7194]">{task.logged}h / {task.estimate}h</span>
          </div>
          <MiniProgressBar pct={pct} color={pct >= 100 ? "#f87171" : pct >= 75 ? "#e8a045" : "#8b7cf8"} />
          <p className="text-[10px] text-[#6b7194] mt-1">{pct}% logged</p>
        </div>

        {/* Timer */}
        {(onStartTimer || onStopTimer) && (
          <TaskTimer task={task} onStart={onStartTimer} onStop={onStopTimer} />
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div>
            <p className="text-[9px] text-[#6b7194] mb-1.5 font-semibold uppercase tracking-wider">Tags</p>
            <div className="flex flex-wrap gap-1">{task.tags.map(t => <TagChip key={t} label={t} />)}</div>
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-[9px] text-[#6b7194] mb-1.5 font-semibold uppercase tracking-wider">Description</p>
          <p className="text-[11px] text-[#8890aa] leading-relaxed">{task.description}</p>
        </div>

        {/* Linked docs */}
        {linkedDocObjs.length > 0 && (
          <div>
            <p className="text-[9px] text-[#6b7194] mb-1.5 font-semibold uppercase tracking-wider">Documents</p>
            <div className="space-y-1">
              {linkedDocObjs.map(doc => (
                <div key={doc.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] transition-colors cursor-pointer group">
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ color: TASK_DOC_TYPE_CONFIG[doc.type].color, backgroundColor: TASK_DOC_TYPE_CONFIG[doc.type].color + "22" }}>
                    {TASK_DOC_TYPE_CONFIG[doc.type].label.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-[#8890aa] truncate flex-1">{doc.title}</span>
                  <ExternalLink size={9} className="text-[#6b7194] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="flex items-center gap-2 text-[#6b7194]">
          <MessageSquare size={12} />
          <span className="text-[12px]">{task.comments} comment{task.comments !== 1 ? "s" : ""}</span>
        </div>

        {/* Launch apps */}
        {onOpenApp && (
          <div>
            <p className="text-[9px] text-[#6b7194] mb-1.5 font-semibold uppercase tracking-wider">Open In App</p>
            <div className="space-y-1">
              {(Object.keys(TASK_APP_CONFIG) as TaskLinkedApp[]).map(app => {
                const cfg = TASK_APP_CONFIG[app];
                const Icon = cfg.Icon;
                const linked = task.linkedApp === app;
                return (
                  <button key={app}
                    onClick={() => onOpenApp(app)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors border ${
                      linked
                        ? "border-[rgba(255,255,255,0.12)] text-[#e8e8f2] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)]"
                        : "border-transparent text-[#6b7194] hover:text-[#a0a4b8] hover:bg-[rgba(255,255,255,0.03)]"
                    }`}>
                    <Icon size={13} style={{ color: cfg.color }} />
                    {cfg.label}
                    {linked && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4ade80]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
