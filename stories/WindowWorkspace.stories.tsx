import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  WindowWorkspace,
  type SplitWorkspacePane,
  type WorkspaceRecordDTO,
  type WorkspaceStateDTO,
} from "../src";
import { createPaneLoadRegistry, paneLoadOptionKeys, paneParticipants } from "./paneAreaFixtures";

const meta = {
  title: "Workspaces/Window Workspace",
  component: WindowWorkspace,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Workspace title shown in the header." },
    subtitle: { control: "text", description: "Header subtitle for context." },
    layout: { control: "radio", options: ["canvas", "split"], description: "Window arrangement mode." },
    gridOrientation: { control: "radio", options: ["row", "column"], description: "Auto-grid grouping orientation." },
  },
  args: {
    title: "Window Workspace",
    subtitle: "Dynamic support panes",
    layout: "canvas",
    gridOrientation: "row",
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Workspace manager used on the right side of the Council Messages + multitasking flow. Supports initial empty state, first-window creation, and additional tab/window panes.",
      },
    },
  },
} satisfies Meta<typeof WindowWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

function WindowWorkspaceStory() {
  const [layoutId, setLayoutId] = React.useState("layout-research");
  const [nextPaneNumber, setNextPaneNumber] = React.useState(1);
  const [panes, setPanes] = React.useState<SplitWorkspacePane[]>([]);

  return (
    <div className="h-[100dvh]">
      <WindowWorkspace
        className="h-full"
        title="Window Workspace"
        subtitle="Dynamic support panes"
        workspaceOptions={[
          {
            label: "Saved layouts",
            options: [
              { id: "layout-research", label: "Research + Docs" },
              { id: "layout-review", label: "Review + Decisions" },
            ],
          },
        ]}
        selectedWorkspaceId={layoutId}
        onWorkspaceChange={setLayoutId}
        panes={panes}
        workspaceContext={{ participantsCount: paneParticipants.length, participants: paneParticipants }}
        loadOptionRegistry={createPaneLoadRegistry()}
        onAddPaneRequest={() => {
          const paneNumber = nextPaneNumber;
          setNextPaneNumber((current) => current + 1);
          setPanes((current) => [
            ...current,
            {
              id: `window-${paneNumber}`,
              title: `Window ${paneNumber}`,
              canClose: true,
              loadOptionKeys: paneLoadOptionKeys,
              groupId: "support",
              menuActions: [
                { id: "duplicate", label: "Duplicate window" },
                { id: "pin", label: "Pin tab" },
              ],
            },
          ]);
        }}
        onPaneClose={(paneId) => setPanes((current) => current.filter((pane) => pane.id !== paneId))}
        onSaveLayout={() => undefined}
      />
    </div>
  );
}

export const Workspace: Story = {
  render: () => <WindowWorkspaceStory />,
};

export const PersistenceContract: Story = {
  render: () => {
    const state: WorkspaceStateDTO = {
      layout: "canvas",
      gridOrientation: "row",
      rightPanelOpen: true,
      panes: [
        { id: "window-1", title: "Window 1", groupId: "support", loadOptionId: "documents", canClose: true },
        { id: "window-2", title: "Window 2", groupId: "support", loadOptionId: "calendar", canClose: true },
      ],
    };

    const dto: WorkspaceRecordDTO = {
      id: "ws_01JXEXAMPLE",
      orgId: "org_abc",
      name: "Sprint Planning Workspace",
      kind: "split",
      description: "Thread + window multitasking workspace",
      threadBinding: {
        threadId: "thread_sprint_planning",
        mode: "decide",
        responseMode: "balanced",
      },
      state,
      createdBy: "user_123",
      createdAt: "2026-05-09T10:00:00.000Z",
      updatedAt: "2026-05-09T10:12:00.000Z",
    };

    return (
      <div className="grid h-[88vh] gap-4 p-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2">Baseline Workspace DTO</h4>
          <p className="mb-3 text-sm text-muted-foreground">Use this contract for migrations and API payloads.</p>
          <pre className="max-h-[70vh] overflow-auto rounded bg-muted/30 p-3 text-xs">{JSON.stringify(dto, null, 2)}</pre>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2">State-Only Update Example</h4>
          <p className="mb-3 text-sm text-muted-foreground">`PATCH /workspaces/:id` body with changed pane layout.</p>
          <pre className="max-h-[70vh] overflow-auto rounded bg-muted/30 p-3 text-xs">
{JSON.stringify(
  {
    state: {
      ...state,
      panes: state.panes.map((pane, index) => ({
        ...pane,
        layout: { x: 24 + index * 420, y: 24, width: 400, height: 280 },
      })),
    },
  },
  null,
  2,
)}
          </pre>
        </div>
      </div>
    );
  },
};
