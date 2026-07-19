import { useEffect, useState } from "react";
import { Pause, Play, Timer } from "lucide-react";
import { formatDuration, runningSession, sessionMs, totalTrackedMs, type TaskItem } from "../../types/tasking";

export interface TaskTimerProps {
  task: TaskItem;
  /** Start a new work session on this task. The caller owns the task state. */
  onStart?: (taskId: string) => void;
  /** Close the open work session on this task. */
  onStop?: (taskId: string) => void;
}

/**
 * Start/stop time tracking with live elapsed display. Work is tracked in
 * bite-sized sessions (timestamp pairs on task.timeSessions) that sum into
 * total tracked time.
 */
export function TaskTimer({ task, onStart, onStop }: TaskTimerProps) {
  const running = runningSession(task);

  // Tick once a second while a session is open so the elapsed display is live.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [running?.id]);

  const total = totalTrackedMs(task, now);
  const sessions = task.timeSessions ?? [];
  const finished = sessions.filter((s) => s.endedAt);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[9px] text-[#6b7194] font-semibold uppercase tracking-wider flex items-center gap-1">
          <Timer size={10} />Timer
        </p>
        {total > 0 && (
          <span className="text-[10px] font-mono text-[#6b7194]">{formatDuration(total)} tracked</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => (running ? onStop?.(task.id) : onStart?.(task.id))}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold transition-colors border ${
          running
            ? "border-[rgba(248,113,113,0.35)] text-[#f87171] bg-[rgba(248,113,113,0.08)] hover:bg-[rgba(248,113,113,0.14)]"
            : "border-[rgba(74,222,128,0.3)] text-[#4ade80] bg-[rgba(74,222,128,0.06)] hover:bg-[rgba(74,222,128,0.12)]"
        }`}
      >
        {running ? <Pause size={12} /> : <Play size={12} />}
        {running ? `Stop — ${formatDuration(sessionMs(running, now))}` : "Start timer"}
      </button>

      {finished.length > 0 && (
        <div className="mt-2 space-y-1">
          {finished.slice(-3).reverse().map((s) => (
            <div key={s.id} className="flex items-center justify-between px-2 py-1 rounded bg-[rgba(255,255,255,0.03)]">
              <span className="text-[9px] text-[#6b7194]">
                {new Date(s.startedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
              <span className="text-[9px] font-mono text-[#8890aa]">{formatDuration(sessionMs(s))}</span>
            </div>
          ))}
          {finished.length > 3 && (
            <p className="text-[9px] text-[#4a4e6a] text-center">+{finished.length - 3} earlier session{finished.length - 3 > 1 ? "s" : ""}</p>
          )}
        </div>
      )}
    </div>
  );
}
