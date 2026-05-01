import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { SplitWorkspace, type SplitWorkspacePane } from "../src";
import { createPaneLoadRegistry, paneLoadOptionKeys, paneParticipants } from "./paneAreaFixtures";

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
        title="SplitWorkspace"
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
