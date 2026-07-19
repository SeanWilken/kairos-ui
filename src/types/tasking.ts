// Tasking (Plan) contract shared across the myAI suite. KnowLedger is the
// primary surface; other apps (e.g. myAIDE) can read/write tasks through this
// shape while ignoring the parts they don't need.

export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";
export type TaskLinkedApp = "ide" | "council" | "knowledge";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

/** One start/stop stint on a task's timer; open sessions have no endedAt. */
export interface WorkSession {
  id: string;
  startedAt: string;
  endedAt?: string;
}

export interface TaskItem {
  id: string;
  key: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  estimate: number;
  logged: number;
  tags: string[];
  sprintId: string;
  order: number;
  comments: number;
  linkedDocs: string[];
  linkedApp?: TaskLinkedApp;
  timeSessions?: WorkSession[];
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  velocity: number;
  status: "active" | "planned" | "completed";
}

export interface TaskDoc {
  id: string;
  title: string;
  type: "sop" | "faq" | "requirements" | "policy" | "guidelines";
  updatedAt: string;
  linkedTasks: string[];
}

export function sessionMs(s: WorkSession, now = Date.now()): number {
  const start = new Date(s.startedAt).getTime();
  const end = s.endedAt ? new Date(s.endedAt).getTime() : now;
  return Math.max(0, end - start);
}

export function totalTrackedMs(task: TaskItem, now = Date.now()): number {
  return (task.timeSessions ?? []).reduce((sum, s) => sum + sessionMs(s, now), 0);
}

export function runningSession(task: TaskItem): WorkSession | undefined {
  return (task.timeSessions ?? []).find((s) => !s.endedAt);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
