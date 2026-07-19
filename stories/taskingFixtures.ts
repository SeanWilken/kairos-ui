import type { Sprint, TaskDoc, TaskItem, TeamMember } from "../src";

export const MEMBERS: TeamMember[] = [
  { id: "m1", name: "Sarah Chen",      role: "Lead Engineer", initials: "SC", color: "#8b7cf8" },
  { id: "m2", name: "Marcus Williams", role: "Backend Dev",   initials: "MW", color: "#e8a045" },
  { id: "m3", name: "Priya Patel",     role: "Frontend Dev",  initials: "PP", color: "#4ade80" },
  { id: "m4", name: "Alex Kim",        role: "DevOps",        initials: "AK", color: "#60a5fa" },
];

export const SPRINTS: Sprint[] = [
  { id: "s1", name: "Sprint 14 — Platform Core", goal: "Stabilize API gateway and ship authentication v2", startDate: "2026-07-01", endDate: "2026-07-14", velocity: 42, status: "active" },
  { id: "s2", name: "Sprint 15 — Data Layer",    goal: "Implement caching layer and optimize database queries", startDate: "2026-07-15", endDate: "2026-07-28", velocity: 38, status: "planned" },
  { id: "s3", name: "Sprint 16 — UI Refresh",    goal: "Component library migration and accessibility audit", startDate: "2026-07-29", endDate: "2026-08-11", velocity: 35, status: "planned" },
];

export const DOCS: TaskDoc[] = [
  { id: "d1", title: "Authentication v2 Specification", type: "requirements", updatedAt: "2026-07-08", linkedTasks: ["t1"] },
  { id: "d2", title: "Security Policy & Guidelines",    type: "policy",       updatedAt: "2026-07-01", linkedTasks: ["t1"] },
];

export const TASKS: TaskItem[] = [
  { id: "t1", key: "PLAT-142", title: "Implement OAuth2 token refresh flow", description: "Refresh token rotation with PKCE support and security hardening.", status: "in-progress", priority: "critical", assigneeId: "m1", dueDate: "2026-07-10", estimate: 8, logged: 5, tags: ["auth", "security"], sprintId: "s1", order: 0, comments: 7, linkedDocs: ["d1", "d2"], linkedApp: "ide",
    timeSessions: [
      { id: "ws1", startedAt: "2026-07-08T14:00:00Z", endedAt: "2026-07-08T15:25:00Z" },
      { id: "ws2", startedAt: "2026-07-09T09:10:00Z", endedAt: "2026-07-09T09:55:00Z" },
    ] },
  { id: "t2", key: "PLAT-143", title: "API gateway rate limiting middleware", description: "Configurable rate limiting with per-tenant overrides.", status: "in-progress", priority: "high", assigneeId: "m2", dueDate: "2026-07-11", estimate: 6, logged: 3, tags: ["api", "performance"], sprintId: "s1", order: 1, comments: 4, linkedDocs: [], linkedApp: "ide" },
  { id: "t3", key: "PLAT-144", title: "User session analytics dashboard", description: "Real-time session monitoring dashboard.", status: "todo", priority: "high", assigneeId: "m3", dueDate: "2026-07-12", estimate: 10, logged: 0, tags: ["analytics", "ui"], sprintId: "s1", order: 2, comments: 2, linkedDocs: [] },
  { id: "t4", key: "PLAT-145", title: "Docker compose production config", description: "Production-grade compose with health checks.", status: "review", priority: "high", assigneeId: "m4", dueDate: "2026-07-09", estimate: 4, logged: 4, tags: ["devops"], sprintId: "s1", order: 3, comments: 6, linkedDocs: [] },
  { id: "t5", key: "PLAT-147", title: "API documentation update", description: "OpenAPI spec and migration guide for v2 endpoints.", status: "done", priority: "medium", assigneeId: "m3", dueDate: "2026-07-08", estimate: 3, logged: 3, tags: ["docs"], sprintId: "s1", order: 4, comments: 0, linkedDocs: [], linkedApp: "knowledge" },
  { id: "t6", key: "PLAT-149", title: "Security audit — dependency scan", description: "OWASP dependency check across all services.", status: "backlog", priority: "critical", assigneeId: "m1", dueDate: "2026-07-14", estimate: 6, logged: 0, tags: ["security", "audit"], sprintId: "s1", order: 5, comments: 0, linkedDocs: ["d2"], linkedApp: "council" },
];
