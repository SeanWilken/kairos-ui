import * as React from "react";
import { Calendar, FileSearch, FileText, ListChecks, MessageSquareText, Users } from "lucide-react";

import {
  ActionItemRow,
  DecisionCard,
  ParticipantChip,
  type ChatMessage,
  type ChatParticipant,
  type SplitWorkspaceLoadOptionSpec,
} from "../src";
import { ChatThreadArea } from "../src/components/ChatThreadArea";
import type { ActionItem, Decision } from "../src/types";

export const paneParticipants: ChatParticipant[] = [
  { id: "pm-1", name: "Alex Chen", role: "PM", avatarColor: "#0e7490" },
  { id: "dev-1", name: "Jordan Kim", role: "Senior Dev", avatarColor: "#4338ca" },
  { id: "qa-1", name: "Riley Brooks", role: "QA", avatarColor: "#b45309" },
];

export const paneMessages: ChatMessage[] = [
  { id: "m-1", role: "user", content: "Should we ship bulk edits this sprint?", timestamp: new Date("2026-04-26T09:02:00") },
  { id: "m-2", role: "participant", participantId: "pm-1", content: "Yes, with controlled rollout.", timestamp: new Date("2026-04-26T09:03:00") },
  { id: "m-3", role: "participant", participantId: "dev-1", content: "Edge cases need stronger QA coverage.", timestamp: new Date("2026-04-26T09:04:00") },
  { id: "m-4", role: "participant", participantId: "qa-1", content: "Gate to 20% and monitor telemetry.", timestamp: new Date("2026-04-26T09:05:00") },
];

export const paneActionItems: ActionItem[] = [
  {
    id: "a-1",
    roomId: "room-1",
    content: "Add upload size limit and per-row validation copy",
    assignee: "dev-1",
    dueDate: new Date("2026-04-28T12:00:00"),
    status: "in_progress",
    timestamp: new Date("2026-04-26T09:10:00"),
  },
  {
    id: "a-2",
    roomId: "room-1",
    content: "Prepare focused test plan for failed row retries",
    assignee: "qa-1",
    dueDate: new Date("2026-04-29T12:00:00"),
    status: "pending",
    timestamp: new Date("2026-04-26T09:11:00"),
  },
];

export const paneDecisions: Decision[] = [
  {
    id: "d-1",
    roomId: "room-1",
    content: "Ship bulk edits as MVP this sprint behind rollout controls",
    alternatives: ["Delay full feature", "Ship to all orgs immediately"],
    rationale: "Balances speed with risk exposure.",
    timestamp: new Date("2026-04-26T09:12:00"),
    participants: ["pm-1", "dev-1", "qa-1"],
  },
];

export const paneLoadOptionKeys = ["thread-alex", "participants", "actions", "decisions", "documents", "calendar"];

export function createPaneLoadRegistry(): Record<string, SplitWorkspaceLoadOptionSpec> {
  const ThreadArea = () => {
    const [mode, setMode] = React.useState("decide");
    const [responseMode, setResponseMode] = React.useState("balanced");
    return (
      <ChatThreadArea
        messages={paneMessages}
        participants={paneParticipants}
        placeholder="Ask a question..."
        mode={mode}
        modeOptions={["ask", "decide", "plan", "execute"]}
        onModeChange={setMode}
        responseMode={responseMode}
        responseModeOptions={["fast", "thinking", "balanced"]}
        onResponseModeChange={setResponseMode}
      />
    );
  };

  return {
    "thread-alex": {
      id: "thread-alex",
      title: "Thread: Alex Chen",
      description: "Load this chat thread and related windows",
      icon: <MessageSquareText className="w-4 h-4" />,
      render: () => <ThreadArea />,
    },
    participants: {
      id: "participants",
      title: "Participants",
      description: "Open participant list widget",
      icon: <Users className="w-4 h-4" />,
      isAvailable: (context) => Number(context.participantsCount ?? 0) > 1,
      render: () => (
        <div className="h-full p-4 space-y-2">
          {paneParticipants.map((participant) => (
            <ParticipantChip key={participant.id} persona={{ ...participant, description: "" }} />
          ))}
        </div>
      ),
    },
    actions: {
      id: "actions",
      title: "Actions (Tasks)",
      description: "Open action items widget",
      icon: <ListChecks className="w-4 h-4" />,
      render: () => (
        <div className="h-full p-4 space-y-2">
          {paneActionItems.map((item) => (
            <ActionItemRow key={item.id} item={item} resolvePersona={(id) => paneParticipants.find((p) => p.id === id)} />
          ))}
        </div>
      ),
    },
    decisions: {
      id: "decisions",
      title: "Decisions",
      description: "Open decisions widget",
      icon: <FileSearch className="w-4 h-4" />,
      render: () => (
        <div className="h-full p-4">
          <DecisionCard decision={paneDecisions[0]} resolvePersona={(id) => paneParticipants.find((p) => p.id === id)} />
        </div>
      ),
    },
    documents: {
      id: "documents",
      title: "Documents",
      description: "Open PDF/documents viewer",
      icon: <FileText className="w-4 h-4" />,
      render: () => <div className="h-full p-4 text-sm text-muted-foreground">PDF/Document viewer placeholder</div>,
    },
    calendar: {
      id: "calendar",
      title: "Calendar",
      description: "Open calendar widget",
      icon: <Calendar className="w-4 h-4" />,
      render: () => <div className="h-full p-4 text-sm">Calendar widget placeholder</div>,
    },
  };
}
