import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Download, FileOutput, FileSearch, FileText, Target } from "lucide-react";

import {
  ActionItemRow,
  ChatWorkspace,
  type ChatMessage,
  type ChatParticipant,
  DecisionCard,
} from "../src";
import type { ActionItem, Decision } from "../src/types";

const participants: ChatParticipant[] = [
  { id: "pm-1", name: "Alex Chen", role: "PM", avatarColor: "#0e7490" },
  { id: "dev-1", name: "Jordan Kim", role: "Senior Dev", avatarColor: "#4338ca" },
  { id: "qa-1", name: "Riley Brooks", role: "QA", avatarColor: "#b45309" },
];

const starterMessages: ChatMessage[] = [
  {
    id: "m-1",
    role: "user",
    content: "Can we ship bulk edit MVP this sprint?",
    timestamp: new Date("2026-04-26T09:02:00"),
  },
  {
    id: "m-2",
    role: "participant",
    participantId: "pm-1",
    content: "Yes, if we keep it to upload + validation.",
    timestamp: new Date("2026-04-26T09:03:00"),
    meta: <span className="text-xs text-muted-foreground">Confidence: 88%</span>,
  },
  {
    id: "m-3",
    role: "participant",
    participantId: "qa-1",
    content: "Let's gate rollout and monitor telemetry for 48 hours.",
    timestamp: new Date("2026-04-26T09:05:00"),
    meta: <span className="text-xs text-muted-foreground">Confidence: 86%</span>,
  },
];

const actionItems: ActionItem[] = [
  {
    id: "a-1",
    roomId: "room-1",
    content: "Implement upload size limit and user-facing validation copy",
    assignee: "dev-1",
    dueDate: new Date("2026-04-28T12:00:00"),
    status: "in_progress",
    timestamp: new Date("2026-04-26T09:10:00"),
  },
];

const decisions: Decision[] = [
  {
    id: "d-1",
    roomId: "room-1",
    content: "Ship MVP behind controlled rollout",
    alternatives: ["Delay to next sprint", "Ship broadly now"],
    rationale: "Balances delivery speed with risk management.",
    timestamp: new Date("2026-04-26T09:12:00"),
    participants: ["pm-1", "dev-1", "qa-1"],
  },
];

const meta = {
  title: "Chat/Thread Workspace",
  component: ChatWorkspace,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChatWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkspaceStory() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(starterMessages);
  const [mode, setMode] = React.useState("decide");
  const [responseMode, setResponseMode] = React.useState("balanced");
  const [lastRoomAction, setLastRoomAction] = React.useState("");
  const [lastInputAction, setLastInputAction] = React.useState("");

  const resolvePersona = (id: string) => participants.find((participant) => participant.id === id);

  return (
    <div style={{ height: "100dvh" }}>
      <ChatWorkspace
        title="Sprint Planning Message Center"
        subtitle="Message center"
        participants={participants}
        messages={messages}
        mode={mode}
        modeOptions={["ask", "debate", "decide", "plan", "execute"]}
        onModeChange={setMode}
        responseMode={responseMode}
        responseModeOptions={["fast", "thinking", "balanced"]}
        onResponseModeChange={setResponseMode}
        onSendMessage={(value) => {
          setMessages((current) => [
            ...current,
            { id: `m-${Date.now()}`, role: "user", content: value, timestamp: new Date() },
          ]);
        }}
        commandSpecMap={{
          "/focus": {
            key: "/focus",
            label: "/focus",
            menuLabel: "Focus Group",
            description: "Delegate to a temporary persona working group.",
            prefix: "/focus ",
            tokens: [
              {
                key: "mentions",
                label: "mentions",
                kind: "mentions",
                placeholder: "Type @names for the focus group",
                suggestions: participants.map((p) => `@${p.name.replace(/\s+/g, "")}`),
              },
              {
                key: "task",
                label: "task",
                kind: "task",
                placeholder: "Define the task goal",
                suggestions: ["Review API risks", "Draft rollout plan", "Compare alternatives"],
              },
              {
                key: "context",
                label: "context",
                kind: "context",
                placeholder: "Attach docs/messages/constraints",
                suggestions: ["Release notes doc", "Last 20 messages", "Bulk edit telemetry"],
              },
            ],
          },
        }}
        inputActions={[
          {
            id: "focus-group",
            label: "Focus Group",
            description: "Create a private sub-thread between selected personas.",
            prefix: "/focus @Architect @SecurityReviewer Goal: ",
          },
          {
            id: "summarize",
            label: "Summarize",
            description: "Summarize the latest context.",
            prefix: "/summarize last 30 messages",
          },
        ]}
        onInputActionSelect={(action) => setLastInputAction(action.id)}
        onCommandTokenHintSelect={(_, tokenKey, suggestion) => {
          setLastInputAction(`${tokenKey}:${suggestion}`);
        }}
        actionMenuItems={[
          { id: "documents", icon: FileText, label: "Documents", description: "View side-by-side" },
          { id: "audit", icon: FileSearch, label: "Audit Review", description: "See reasoning" },
          { id: "export", icon: Download, label: "Export", description: "Save history" },
          { id: "summarize", icon: FileOutput, label: "Summarize", description: "Get summary" },
          { id: "create-docs", icon: FileText, label: "Create Docs", description: "Generate docs" },
          { id: "refocus", icon: Target, label: "Refocus", description: "Reshape topic" },
        ]}
        onActionMenuSelect={(id) => setLastRoomAction(id)}
        footerSlot={
          <div className="px-4 pb-2 text-xs text-muted-foreground">
            {lastRoomAction ? `Last room action: ${lastRoomAction}` : "No room action selected"}
            {lastInputAction ? ` | Last input action: ${lastInputAction}` : ""}
          </div>
        }
        rightPanel={
          <div className="h-full p-4 space-y-4">
            <div>
              <h4 className="mb-2">Participants</h4>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="rounded-md border border-border p-2 text-sm">
                    <div>{participant.name}</div>
                    <div className="text-xs text-muted-foreground">{participant.role}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2">Action Items</h4>
              {actionItems.map((item) => (
                <ActionItemRow key={item.id} item={item} resolvePersona={resolvePersona} />
              ))}
            </div>
            <div>
              <h4 className="mb-2">Decisions</h4>
              {decisions.map((decision) => (
                <DecisionCard key={decision.id} decision={decision} resolvePersona={resolvePersona} />
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <WorkspaceStory />,
};

export const CompactAssistantMode: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<ChatMessage[]>([
      {
        id: "assistant-1",
        role: "assistant",
        content: "Hi! I can help with meeting notes or planning.",
        timestamp: new Date(),
      },
    ]);
    const [mode, setMode] = React.useState("ask");
    const [responseMode, setResponseMode] = React.useState("fast");

    return (
      <div className="h-[520px] w-[380px] border border-border rounded-lg overflow-hidden">
        <ChatWorkspace
          compact
          hideHeader
          threadVariant="direct"
          mode={mode}
          modeOptions={["ask", "decide", "plan", "execute"]}
          onModeChange={setMode}
          responseMode={responseMode}
          responseModeOptions={["fast", "thinking", "balanced"]}
          onResponseModeChange={setResponseMode}
          inputActions={[
            {
              id: "focus-group",
              label: "Focus Group",
              description: "Delegate to a small persona working group.",
              prefix: "/focus @Architect @Analyst Goal: ",
            },
          ]}
          messages={messages}
          commandSpecMap={{
            "/focus": {
              key: "/focus",
              label: "/focus",
              menuLabel: "Focus Group",
              prefix: "/focus ",
              tokens: [
                { key: "mentions", label: "mentions", kind: "mentions", suggestions: ["@Architect", "@Analyst"] },
                { key: "task", label: "task", kind: "task", suggestions: ["Summarize blockers"] },
                { key: "context", label: "context", kind: "context", suggestions: ["Current thread"] },
              ],
            },
          }}
          onSendMessage={(value) => {
            setMessages((current) => [
              ...current,
              { id: `u-${Date.now()}`, role: "user", content: value, timestamp: new Date() },
            ]);
          }}
          placeholder="Ask me anything..."
        />
      </div>
    );
  },
};
