import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileText, Search } from "lucide-react";

import {
  SplitWorkspace,
  type SplitWorkspacePane,
} from "../src";

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
  const [panes, setPanes] = React.useState<SplitWorkspacePane[]>([
    {
      id: "chat",
      title: "Chat",
      loadedLabel: "Chat: Alex Chen",
      description: "Primary conversation",
      defaultSize: 45,
      minSize: 25,
      menuActions: [
        { id: "mute", label: "Mute conversation" },
        { id: "pin", label: "Pin pane" },
        { id: "archive", label: "Archive" },
      ],
      outlet: (
        <div className="h-full p-4">
          <p className="text-sm">Chat content pane</p>
        </div>
      ),
    },
    {
      id: "docs",
      title: "Documents",
      loadedLabel: "Document Viewer",
      description: "Source material",
      defaultSize: 35,
      minSize: 20,
      canClose: true,
      menuActions: [
        { id: "open-source", label: "Open source" },
        { id: "new-tab", label: "Open in new tab" },
      ],
      outlet: (
        <div className="h-full p-4">
          <p className="text-sm">Document viewer pane</p>
        </div>
      ),
    },
    {
      id: "audit",
      title: "Audit Review",
      loadedLabel: "Audit Review",
      description: "Reasoning details",
      defaultSize: 20,
      minSize: 20,
      canClose: true,
      menuActions: [
        { id: "rerun", label: "Rerun audit" },
        { id: "export", label: "Export details" },
      ],
      outlet: (
        <div className="h-full p-4">
          <p className="text-sm">Audit pane</p>
        </div>
      ),
    },
  ]);

  const addPane = (kind: "docs" | "audit") => {
    const exists = panes.some((pane) => pane.id === kind);
    if (exists) return;

    const next: SplitWorkspacePane =
      kind === "docs"
        ? {
            id: "docs",
            title: "Documents",
            loadedLabel: "Document Viewer",
            description: "Source material",
            minSize: 20,
            canClose: true,
            menuActions: [
              { id: "open-source", label: "Open source" },
              { id: "new-tab", label: "Open in new tab" },
            ],
            outlet: <div className="h-full p-4 text-sm">Document viewer pane</div>,
          }
        : {
            id: "audit",
            title: "Audit Review",
            loadedLabel: "Audit Review",
            description: "Reasoning details",
            minSize: 20,
            canClose: true,
            menuActions: [
              { id: "rerun", label: "Rerun audit" },
              { id: "export", label: "Export details" },
            ],
            outlet: <div className="h-full p-4 text-sm">Audit pane</div>,
          };

    setPanes((current) => [...current, next]);
  };

  return (
    <div className="h-[100dvh] p-4 bg-muted/20">
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="h-9 px-3 rounded-md border border-border bg-background text-sm inline-flex items-center gap-2 hover:bg-accent"
          onClick={() => addPane("docs")}
        >
          <FileText className="w-4 h-4" />
          Add Documents Pane
        </button>
        <button
          type="button"
          className="h-9 px-3 rounded-md border border-border bg-background text-sm inline-flex items-center gap-2 hover:bg-accent"
          onClick={() => addPane("audit")}
        >
          <Search className="w-4 h-4" />
          Add Audit Pane
        </button>
        <button
          type="button"
          className="h-9 px-3 rounded-md border border-border bg-background text-sm inline-flex items-center gap-2 hover:bg-accent"
          onClick={() => {
            const newId = `pane-${nextPaneNumber}`;
            setNextPaneNumber((current) => current + 1);
            setPanes((current) => [
              ...current,
              {
                id: newId,
                title: `Pane ${nextPaneNumber}`,
                loadedLabel: `Pane ${nextPaneNumber}`,
                canClose: true,
                menuActions: [
                  { id: "load", label: "Load content" },
                  { id: "detach", label: "Detach" },
                ],
              },
            ]);
          }}
        >
          Add Empty Pane
        </button>
      </div>

      {lastPaneAction ? (
        <div className="mb-2 text-xs text-muted-foreground">Last pane action: {lastPaneAction}</div>
      ) : null}

      <SplitWorkspace
        title="SplitWorkspace"
        subtitle="Dynamic multi-pane canvas"
        panes={panes}
        handleWithGrip
        onPaneActionSelect={(paneId, actionId) => {
          setLastPaneAction(`${paneId}:${actionId}`);
        }}
        onPaneLoadRequest={(paneId) => {
          setLastPaneAction(`${paneId}:load-content`);
        }}
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
