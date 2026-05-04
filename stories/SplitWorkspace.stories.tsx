import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeftRight, LayoutGrid, Menu, PanelRightClose, PanelRightDashed, Save } from "lucide-react";

import { ActionItemRow, ChatWorkspace, DecisionCard, LeftSidebarMenu, SplitWorkspace, type SplitWorkspacePane } from "../src";
import { createPaneLoadRegistry, paneActionItems, paneDecisions, paneLoadOptionKeys, paneMessages, paneParticipants } from "./paneAreaFixtures";

const meta = {
  title: "Chat/Split Workspace",
  component: SplitWorkspace,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SplitWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

function SplitWorkspaceDemo() {
  const [lastPaneAction, setLastPaneAction] = React.useState("");
  const [nextPaneNumber, setNextPaneNumber] = React.useState(4);
  const [workspaceId, setWorkspaceId] = React.useState("messages-sprint");
  const [panes, setPanes] = React.useState<SplitWorkspacePane[]>([
      {
        id: "chat",
        title: "Chat",
        description: "Primary conversation",
        defaultSize: 45,
        minSize: 25,
        menuActions: [
          { id: "mute", label: "Mute conversation" },
          { id: "pin", label: "Pin pane" },
          { id: "archive", label: "Archive" },
        ],
        groupId: "thread-alex",
        loadOptionKeys: paneLoadOptionKeys,
      },
    {
      id: "docs",
      title: "Documents",
      description: "Source material",
      defaultSize: 35,
      minSize: 20,
      canClose: true,
        menuActions: [
          { id: "open-source", label: "Open source" },
          { id: "new-tab", label: "Open in new tab" },
        ],
        groupId: "thread-alex",
        loadOptionKeys: paneLoadOptionKeys,
      },
    {
      id: "audit",
      title: "Audit Review",
      description: "Reasoning details",
      defaultSize: 20,
      minSize: 20,
      canClose: true,
        menuActions: [
          { id: "rerun", label: "Rerun audit" },
          { id: "export", label: "Export details" },
        ],
        groupId: "thread-alex",
        loadOptionKeys: paneLoadOptionKeys,
      },
    ]);

  return (
    <div className="h-[100dvh] p-4 bg-muted/20">
      {lastPaneAction ? (
        <div className="mb-2 text-xs text-muted-foreground">Last pane action: {lastPaneAction}</div>
      ) : null}

      <SplitWorkspace
        className="h-full"
        layout="canvas"
        showAddPaneButton
        title="Thread Workspace + Widgets"
        subtitle="Dynamic multi-pane canvas"
        workspaceOptions={[
          {
            label: "Messages",
            options: [
              { id: "messages-sprint", label: "Sprint Planning" },
              { id: "messages-release", label: "Release Notes" },
            ],
          },
          {
            label: "Meetings",
            options: [
              { id: "meetings-weekly", label: "Weekly Review" },
              { id: "meetings-retro", label: "Retrospective" },
            ],
          },
        ]}
        selectedWorkspaceId={workspaceId}
        onWorkspaceChange={setWorkspaceId}
        defaultLoadOptions={
          []
        }
        workspaceContext={{ participantsCount: paneParticipants.length, participants: paneParticipants }}
        loadOptionRegistry={createPaneLoadRegistry()}
        panes={panes}
        handleWithGrip
        onPaneActionSelect={(paneId, actionId) => {
          setLastPaneAction(`${paneId}:${actionId}`);
        }}
        onPaneLoadOptionSelect={(paneId, optionId) => setLastPaneAction(`${paneId}:${optionId}`)}
        onPaneLoadRequest={(paneId) => {
          setLastPaneAction(`${paneId}:load-content`);
        }}
        onAddPaneRequest={() => {
          const newId = `pane-${nextPaneNumber}`;
          setNextPaneNumber((current) => current + 1);
          setPanes((current) => [
            ...current,
            {
              id: newId,
              title: `Pane ${nextPaneNumber}`,
              loadedLabel: `Pane ${nextPaneNumber}`,
              loadOptionKeys: paneLoadOptionKeys,
              canClose: true,
              menuActions: [
                { id: "detach", label: "Detach" },
                { id: "duplicate", label: "Duplicate" },
              ],
            },
          ]);
        }}
        onSaveLayout={() => setLastPaneAction("layout:saved")}
        onPaneClose={(paneId) => {
          if (paneId === "chat") return;
          setPanes((current) => current.filter((pane) => pane.id !== paneId));
        }}
      />
    </div>
  );
}

export const DynamicPanes: Story = {
  render: () => <SplitWorkspaceDemo />,
};

function WorkspaceWithWidgetsDemo() {
  const [messages, setMessages] = React.useState(paneMessages);
  const [mode, setMode] = React.useState("decide");
  const [responseMode, setResponseMode] = React.useState("balanced");
  const [nextPaneNumber, setNextPaneNumber] = React.useState(3);
  const [workspaceOnLeft, setWorkspaceOnLeft] = React.useState(true);
  const [widgetLayoutId, setWidgetLayoutId] = React.useState("layout-research");
  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);
  const [threadMenuOpen, setThreadMenuOpen] = React.useState(false);
  const [panes, setPanes] = React.useState<SplitWorkspacePane[]>([
    { id: "documents", title: "Select content", canClose: true, loadOptionKeys: paneLoadOptionKeys, groupId: "support" },
    { id: "calendar", title: "Select content", canClose: true, loadOptionKeys: paneLoadOptionKeys, groupId: "support" },
  ]);

  const threadHalf = (
    <div className="h-full min-h-0 bg-background relative flex flex-col">
      <LeftSidebarMenu
        isOpen={threadMenuOpen}
        onClose={() => setThreadMenuOpen(false)}
        placement="chat"
        onSelectMode={() => setThreadMenuOpen(false)}
        items={[
          { id: "summarize", icon: Save, label: "Summarize", description: "Summarize thread + widgets" },
          { id: "handoff", icon: LayoutGrid, label: "Create handoff", description: "Prepare context packet" },
        ]}
      />
      <div className="h-14 border-b border-border px-3 flex items-center justify-between gap-3 bg-background">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setThreadMenuOpen(true)}
            className="h-10 w-10 rounded-md border border-border inline-flex items-center justify-center hover:bg-accent"
            title="Open thread workspace actions"
            aria-label="Open thread workspace actions"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h3 className="truncate">Sprint Planning Message Center</h3>
            <p className="truncate text-xs text-muted-foreground">Thread workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRightPanelOpen((current) => !current)}
            className="h-10 w-10 rounded-md border border-border inline-flex items-center justify-center hover:bg-accent"
            title={rightPanelOpen ? "Hide chat side panel" : "Show chat side panel"}
            aria-label={rightPanelOpen ? "Hide chat side panel" : "Show chat side panel"}
          >
            {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightDashed className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setWorkspaceOnLeft((current) => !current)}
            className="h-10 px-3 rounded-md border border-border text-sm inline-flex items-center gap-2 hover:bg-accent"
            title="Swap workspace side"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Swap
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatWorkspace
          hideHeader
          participants={paneParticipants}
          messages={messages}
          mode={mode}
          modeOptions={["ask", "decide", "plan", "execute"]}
          onModeChange={setMode}
          responseMode={responseMode}
          responseModeOptions={["fast", "thinking", "balanced"]}
          onResponseModeChange={setResponseMode}
          inputActions={[
            { id: "focus-group", label: "Focus Group", description: "Run a private group discussion.", prefix: "/focus " },
            { id: "summarize", label: "Summarize", description: "Summarize current thread.", prefix: "/summarize " },
          ]}
          onSendMessage={(value) =>
            setMessages((current) => [...current, { id: `u-${Date.now()}`, role: "user", content: value, timestamp: new Date() }])
          }
          rightPanelOpen={rightPanelOpen}
          onRightPanelOpenChange={setRightPanelOpen}
          rightPanel={
            <div className="h-full p-4 space-y-4">
              <div>
                <h4 className="mb-2">Participants</h4>
                <div className="space-y-2">
                  {paneParticipants.map((participant) => (
                    <div key={participant.id} className="rounded-md border border-border p-2 text-sm">
                      <div>{participant.name}</div>
                      <div className="text-xs text-muted-foreground">{participant.role}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2">Action Items</h4>
                {paneActionItems.map((item) => (
                  <ActionItemRow key={item.id} item={item} resolvePersona={(id) => paneParticipants.find((p) => p.id === id)} />
                ))}
              </div>
              <div>
                <h4 className="mb-2">Decisions</h4>
                {paneDecisions.map((decision) => (
                  <DecisionCard key={decision.id} decision={decision} resolvePersona={(id) => paneParticipants.find((p) => p.id === id)} />
                ))}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );

  const widgetHalf = (
    <div className="h-full min-h-0 bg-background">
      <SplitWorkspace
        className="h-full"
        layout="canvas"
        showTopBar
        showTopBarActions
        showTopBarMenuButton={false}
        showActionBarBelowHeader
        showTopBarAddButton
        title="Widget Workspace"
        subtitle="Dynamic support panes"
        workspaceOptions={[
          {
            label: "Saved layouts",
            options: [
              { id: "layout-research", label: "Research + Docs" },
              { id: "layout-review", label: "Review + Decisions" },
              { id: "layout-calendar", label: "Calendar Focus" },
            ],
          },
        ]}
        selectedWorkspaceId={widgetLayoutId}
        onWorkspaceChange={setWidgetLayoutId}
        panes={panes}
        workspaceContext={{ participantsCount: paneParticipants.length, participants: paneParticipants }}
        loadOptionRegistry={createPaneLoadRegistry()}
        onPaneActionSelect={(paneId, actionId) => {
          if (actionId === "feature") {
            setPanes((current) => {
              const target = current.find((entry) => entry.id === paneId);
              if (!target) return current;
              const others = current.filter((entry) => entry.id !== paneId);
              return [...others, target];
            });
          }
        }}
        onAddPaneRequest={() => {
          const newId = `widget-${nextPaneNumber}`;
          setNextPaneNumber((current) => current + 1);
          setPanes((current) => [
            ...current,
            {
              id: newId,
              title: `Widget ${nextPaneNumber}`,
              canClose: true,
              loadOptionKeys: paneLoadOptionKeys,
              menuActions: [
                { id: "feature", label: "Promote to featured slot" },
                { id: "duplicate", label: "Duplicate" },
              ],
            },
          ]);
        }}
        onPaneClose={(paneId) => setPanes((current) => current.filter((pane) => pane.id !== paneId))}
        onSaveLayout={() => undefined}
      />
    </div>
  );

  return (
    <div className="h-[100dvh] bg-muted/20 p-3">
      <div className="h-full border border-border rounded-lg overflow-hidden bg-background">
        <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-2">
          {workspaceOnLeft ? (
            <>
              <div className="h-full min-h-0 border-r border-border">{threadHalf}</div>
              <div className="h-full min-h-0">{widgetHalf}</div>
            </>
          ) : (
            <>
              <div className="h-full min-h-0">{widgetHalf}</div>
              <div className="h-full min-h-0 border-l border-border">{threadHalf}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const WorkspaceWithWidgets: Story = {
  render: () => <WorkspaceWithWidgetsDemo />,
};
