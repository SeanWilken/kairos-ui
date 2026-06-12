import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeftRight, LayoutGrid, Menu, PanelRightClose, PanelRightDashed, Save } from "lucide-react";

import { ActionItemRow, ChatWorkspace, DecisionCard, LeftSidebarMenu, SplitWorkspace, type SplitWorkspacePane, WindowWorkspace } from "../src";
import { createPaneLoadRegistry, paneActionItems, paneDecisions, paneLoadOptionKeys, paneMessages, paneParticipants } from "./paneAreaFixtures";

const meta = {
  title: "Workspaces/Split Workspace",
  component: SplitWorkspace,
  tags: ["autodocs"],
  argTypes: {
    layout: { control: "radio", options: ["canvas", "split"], description: "Workspace arrangement mode." },
    gridOrientation: { control: "radio", options: ["row", "column"], description: "Auto-grid orientation for canvas panes." },
    showTopBar: { control: "boolean", description: "Show workspace header bar." },
    showTopBarActions: { control: "boolean", description: "Show save/rearrange action controls." },
    showTopBarAddButton: { control: "boolean", description: "Show + button in top action bar." },
    addPaneLabel: { control: "text", description: "Accessible label for add-pane controls." },
  },
  args: {
    layout: "canvas",
    gridOrientation: "row",
    showTopBar: true,
    showTopBarActions: true,
    showTopBarAddButton: true,
    addPaneLabel: "Add window",
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Lower-level pane orchestration primitive behind Window Workspace. Use this directly when you need full control over pane rendering, load options, and drag/resize behavior.",
      },
    },
  },
} satisfies Meta<typeof SplitWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

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
      <WindowWorkspace
        className="h-full"
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

export const ThreadPlusWindowWorkspace: Story = {
  render: () => <WorkspaceWithWidgetsDemo />,
};

function WorkspaceInitializerDemo() {
  const [template, setTemplate] = React.useState("thread-workspace");
  const [workspaceName, setWorkspaceName] = React.useState("Sprint Planning");
  const [initialized, setInitialized] = React.useState(false);

  if (!initialized) {
    return (
      <div className="h-[100dvh] p-6 bg-muted/20 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-xl border border-border bg-background p-5 space-y-4">
          <div>
            <h3>Initialize Split Workspace</h3>
            <p className="text-sm text-muted-foreground">Choose main workspace content and save the workspace definition.</p>
          </div>
          <label className="block text-sm space-y-1">
            <span>Main content template</span>
            <select
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
            >
              <option value="thread-workspace">Thread Workspace</option>
              <option value="support-workspace">Support Workspace</option>
            </select>
          </label>
          <label className="block text-sm space-y-1">
            <span>Workspace name</span>
            <input
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
              placeholder="Enter workspace name"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setInitialized(true)}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Save and open workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh]">
      <WorkspaceWithWidgetsDemo />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
        {template === "thread-workspace" ? "Thread Workspace" : "Support Workspace"} • {workspaceName}
      </div>
    </div>
  );
}

export const InitializedSplitWorkspace: Story = {
  render: () => <WorkspaceInitializerDemo />,
};
