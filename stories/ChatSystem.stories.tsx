import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  FileOutput,
  FileSearch,
  FileText,
  ListChecks,
  Menu,
  PanelRightClose,
  PanelRightDashed,
  Scale,
  Send,
  Target,
  Users,
} from "lucide-react";

import type {
  ActionItem,
  Decision,
  Message,
  MessageInteractionAction,
  MessageStatus,
  Persona,
  RoomMode,
} from "../src/types";
import {
  ActionItemRow,
  AuditSplitView,
  ChatThreadList,
  type ChatThreadItem,
  DecisionCard,
  LeftSidebarMenu,
  MessageInteractionMenu,
  ParticipantChip,
  TurnCard,
} from "../src";

type SidebarTab = "participants" | "actions" | "decisions";

const personas: Persona[] = [
  {
    id: "pm-1",
    name: "Alex Chen",
    role: "PM",
    description: "Product direction and prioritization",
    avatarColor: "#0e7490",
  },
  {
    id: "dev-1",
    name: "Jordan Kim",
    role: "Senior Dev",
    description: "Architecture and technical tradeoffs",
    avatarColor: "#4338ca",
  },
  {
    id: "qa-1",
    name: "Riley Brooks",
    role: "QA",
    description: "Release quality and risk assessment",
    avatarColor: "#b45309",
  },
  {
    id: "design-1",
    name: "Morgan Diaz",
    role: "Design Lead",
    description: "UX constraints and interaction flows",
    avatarColor: "#be185d",
  },
];

const initialMessages: Message[] = [
  {
    id: "m-1",
    role: "user",
    content: "Should we ship bulk edits in this sprint or delay?",
    timestamp: new Date("2026-04-26T09:02:00"),
    status: "complete",
  },
  {
    id: "m-2",
    role: "persona",
    personaId: "pm-1",
    content:
      "We can ship an MVP in this sprint if we keep scope to CSV upload plus single-step validation.",
    timestamp: new Date("2026-04-26T09:03:00"),
    status: "complete",
    confidence: 0.88,
  },
  {
    id: "m-3",
    role: "persona",
    personaId: "dev-1",
    content:
      "Backend changes are low risk, but UI edge cases will need QA coverage for partial failures.",
    timestamp: new Date("2026-04-26T09:04:00"),
    status: "thinking",
    confidence: 0.82,
  },
  {
    id: "m-4",
    role: "persona",
    personaId: "qa-1",
    content:
      "If we ship this sprint, we should gate rollout to 20% of orgs and collect error telemetry for 48 hours.",
    timestamp: new Date("2026-04-26T09:05:00"),
    status: "complete",
    confidence: 0.86,
  },
];

const actionItems: ActionItem[] = [
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

const decisions: Decision[] = [
  {
    id: "d-1",
    roomId: "room-1",
    content: "Ship bulk edits as MVP this sprint behind rollout controls",
    alternatives: ["Delay full feature to next sprint", "Ship to all orgs immediately"],
    rationale: "Balances delivery speed with risk by constraining scope and launch exposure.",
    timestamp: new Date("2026-04-26T09:12:00"),
    participants: ["pm-1", "dev-1", "qa-1"],
  },
];

const modeOptions: RoomMode[] = ["ask", "debate", "decide", "plan", "execute"];

const meta = {
  title: "Chat/Council Workspace",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ChatWorkspaceStory() {
  const TOP_HEADER_HEIGHT = 68;
  const RIGHT_SIDEBAR_WIDTH = 460;
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [draft, setDraft] = React.useState("");
  const [selectedMode, setSelectedMode] = React.useState<RoomMode>("decide");
  const [isModeMenuOpen, setIsModeMenuOpen] = React.useState(false);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = React.useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(true);
  const [sidebarTab, setSidebarTab] = React.useState<SidebarTab>("participants");
  const [messageMenu, setMessageMenu] = React.useState<{ messageId: string; x: number; y: number } | null>(null);
  const [splitViewMode, setSplitViewMode] = React.useState<string | null>(null);
  const [selectedAuditMessageId, setSelectedAuditMessageId] = React.useState<string | null>(null);
  const [lastAction, setLastAction] = React.useState<string>("");

  const resolvePersona = React.useCallback(
    (personaId: string) => personas.find((persona) => persona.id === personaId) ?? null,
    [],
  );

  const selectedAuditMessage =
    (selectedAuditMessageId && messages.find((message) => message.id === selectedAuditMessageId)) ||
    messages.filter((message) => message.role === "persona").at(-1) ||
    null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    const message: Message = {
      id: `m-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
      status: "complete",
    };

    setMessages((current) => [...current, message]);
    setDraft("");
  };

  const handleModeSelect = (mode: string) => {
    if (mode === "audit") {
      const lastPersonaMessage = messages.filter((message) => message.role === "persona").at(-1);
      if (lastPersonaMessage) {
        setSplitViewMode("audit");
        setSelectedAuditMessageId(lastPersonaMessage.id);
      }
      return;
    }

    setSplitViewMode(mode);
  };

  const handleMessageMenuAction = (action: MessageInteractionAction, messageId: string) => {
    const label = action[0].toUpperCase() + action.slice(1);
    setLastAction(`${label} on ${messageId}`);
  };

  const statusByMessageId: Record<string, MessageStatus> = {
    "m-2": "complete",
    "m-3": "thinking",
    "m-4": "complete",
  };

  const hamburgerItems = [
    { id: "documents", icon: FileText, label: "Documents", description: "View side-by-side" },
    { id: "audit", icon: FileSearch, label: "Audit Review", description: "See reasoning" },
    { id: "export", icon: Download, label: "Export", description: "Save history" },
    { id: "summarize", icon: FileOutput, label: "Summarize", description: "Get summary" },
    { id: "create-docs", icon: FileText, label: "Create Docs", description: "Generate docs" },
    { id: "refocus", icon: Target, label: "Refocus", description: "Reshape topic" },
  ];

  const conversations: ChatThreadItem[] = [
    {
      id: "room-1",
      name: "Sprint Planning Council",
      type: "room",
      lastMessage: "Ship bulk edits as MVP this sprint behind rollout controls",
      participantIds: ["pm-1", "dev-1", "qa-1", "design-1", "user"],
      lastMessageTime: new Date("2026-04-26T09:12:00"),
      isPinned: true,
    },
    {
      id: "assistant-1",
      name: "Your Assistant",
      type: "assistant",
      lastMessage: "I can draft the rollout checklist from this thread.",
      participantIds: ["pm-1"],
      lastMessageTime: new Date("2026-04-26T08:41:00"),
      unreadCount: 2,
    },
    {
      id: "direct-1",
      name: "Alex + Jordan + Riley",
      type: "direct",
      lastMessage: "Can you review rollout copy and QA notes before noon?",
      participantIds: ["pm-1", "dev-1", "qa-1"],
      lastMessageTime: new Date("2026-04-25T15:20:00"),
    },
  ];

  return (
    <div className="flex bg-background text-foreground" style={{ height: "100dvh", minHeight: "100dvh" }}>
      {messageMenu ? (
        <MessageInteractionMenu
          isOpen
          messageId={messageMenu.messageId}
          position={{ x: messageMenu.x, y: messageMenu.y }}
          onClose={() => setMessageMenu(null)}
          onAction={handleMessageMenuAction}
        />
      ) : null}

      <ChatThreadList
        className="relative z-30"
        description="Room and direct conversation style from Council pages."
        threads={conversations}
        participants={[...personas, { id: "user", name: "You", avatarColor: "#6b7280" }]}
        selectedThreadId="room-1"
      />

      <div className="flex-1 flex min-h-0 relative">
        <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
          <div
            className="border-b border-border px-6 flex items-center"
            style={{ height: `${TOP_HEADER_HEIGHT}px`, minHeight: `${TOP_HEADER_HEIGHT}px` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeftMenuOpen(true)}
                  className="w-10 h-10 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h2>Sprint Planning Council</h2>
                  <p className="text-sm text-muted-foreground">Council room • {messages.length} messages</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col relative">
            <LeftSidebarMenu
              isOpen={isLeftMenuOpen}
              onClose={() => setIsLeftMenuOpen(false)}
              onSelectMode={handleModeSelect}
              placement="chat"
              items={hamburgerItems}
            />

            <div className="flex-1 overflow-auto px-6">
              <div className="max-w-3xl mx-auto py-4 divide-y divide-border/50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="cursor-pointer hover:bg-accent/30 rounded transition-colors"
                    onClick={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      setSelectedAuditMessageId(message.id);
                      setMessageMenu({
                        messageId: message.id,
                        x: rect.left + 16,
                        y: rect.bottom + 8,
                      });
                    }}
                  >
                    <TurnCard
                      message={{ ...message, status: statusByMessageId[message.id] ?? message.status }}
                      resolvePersona={resolvePersona}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border px-6 py-4">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModeMenuOpen((open) => !open)}
                    className="h-full px-3 py-3 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center gap-2 text-sm capitalize"
                  >
                    {selectedMode}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isModeMenuOpen ? (
                    <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-lg p-1 z-20 min-w-[150px]">
                      {modeOptions.map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          className="w-full text-left px-3 py-2 rounded text-sm capitalize hover:bg-accent"
                          onClick={() => {
                            setSelectedMode(mode);
                            setIsModeMenuOpen(false);
                          }}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="relative flex-1">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Ask a question or start a discussion..."
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
              {lastAction ? <p className="max-w-3xl mx-auto mt-2 text-xs text-muted-foreground">Last action: {lastAction}</p> : null}
            </div>
          </div>
        </div>

        {splitViewMode ? (
          <div className="w-[46%] border-l border-border flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="capitalize">{splitViewMode} view</h3>
              <button
                type="button"
                className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-muted-foreground"
                onClick={() => setSplitViewMode(null)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {splitViewMode === "audit" && selectedAuditMessage ? (
                <AuditSplitView message={selectedAuditMessage} resolvePersona={resolvePersona} />
              ) : (
                <div className="p-6 text-sm text-muted-foreground">{splitViewMode} tools preview</div>
              )}
            </div>
          </div>
        ) : null}

        {isRightSidebarOpen ? (
          <div
            className="shrink-0 border-l border-border flex flex-col min-h-0"
            style={{ width: `${RIGHT_SIDEBAR_WIDTH}px`, minWidth: `${RIGHT_SIDEBAR_WIDTH}px`, maxWidth: `${RIGHT_SIDEBAR_WIDTH}px`, flexBasis: `${RIGHT_SIDEBAR_WIDTH}px` }}
          >
            <div
              className="border-b border-border flex items-stretch"
              style={{ height: `${TOP_HEADER_HEIGHT}px`, minHeight: `${TOP_HEADER_HEIGHT}px` }}
            >
              <button
                type="button"
                className={`h-full flex-1 px-3 text-sm ${sidebarTab === "participants" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                onClick={() => setSidebarTab("participants")}
              >
                <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" />Participants</span>
              </button>
              <button
                type="button"
                className={`h-full flex-1 px-3 text-sm ${sidebarTab === "actions" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                onClick={() => setSidebarTab("actions")}
              >
                <span className="inline-flex items-center gap-1.5"><ListChecks className="w-4 h-4" />Actions</span>
              </button>
              <button
                type="button"
                className={`h-full flex-1 px-3 text-sm ${sidebarTab === "decisions" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
                onClick={() => setSidebarTab("decisions")}
              >
                <span className="inline-flex items-center gap-1.5"><Scale className="w-4 h-4" />Decisions</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRightSidebarOpen(false)}
                className="h-full w-12 border-l border-border text-muted-foreground hover:bg-accent inline-flex items-center justify-center"
                title="Hide sidebar"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {sidebarTab === "participants" ? (
                <div className="space-y-3">
                  {personas.map((persona) => (
                    <ParticipantChip key={persona.id} persona={persona} />
                  ))}
                </div>
              ) : null}

              {sidebarTab === "actions" ? (
                <div className="space-y-1">
                  {actionItems.map((item) => (
                    <ActionItemRow key={item.id} item={item} resolvePersona={resolvePersona} />
                  ))}
                </div>
              ) : null}

              {sidebarTab === "decisions" ? (
                <div className="space-y-3">
                  {decisions.map((decision) => (
                    <DecisionCard key={decision.id} decision={decision} resolvePersona={resolvePersona} />
                  ))}
                </div>
              ) : null}
            </div>

          </div>
        ) : (
          <div
            className="absolute right-0 top-0 z-40 flex items-center"
            style={{ height: `${TOP_HEADER_HEIGHT}px`, minHeight: `${TOP_HEADER_HEIGHT}px` }}
          >
            <button
              type="button"
              onClick={() => setIsRightSidebarOpen(true)}
              className="w-9 h-10 bg-background border border-r-0 border-border rounded-l-md flex items-center justify-center hover:bg-accent"
              title="Open sidebar"
              aria-label="Open sidebar"
            >
              <PanelRightDashed className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-[410px] rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground inline-flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5" />
        Meetings-style scheduling context baked into room actions
      </div>
    </div>
  );
}

export const CouncilChatBuilder: Story = {
  render: () => <ChatWorkspaceStory />,
};
