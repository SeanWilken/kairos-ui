import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileOutput, FileSearch, FileText, LayoutGrid, Wrench } from "lucide-react";

import { LeftSidebarMenu, type LeftSidebarMenuItem } from "../src";

const items: LeftSidebarMenuItem[] = [
  { id: "focus", icon: LayoutGrid, label: "Focus Group", description: "Create a temporary multi-agent group" },
  { id: "documents", icon: FileText, label: "Documents", description: "Open evidence and source files" },
  { id: "audit", icon: FileSearch, label: "Audit Review", description: "Inspect model reasoning and evidence" },
  { id: "summarize", icon: FileOutput, label: "Summarize", description: "Summarize thread and widget state" },
  { id: "tools", icon: Wrench, label: "Tools", description: "Configure approved tool access" },
];

const meta = {
  title: "Components/Action Menu",
  component: LeftSidebarMenu,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "radio",
      options: ["app-shell", "chat", "workspace"],
      description: "Positioning strategy for the action menu overlay.",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LeftSidebarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChatPlacement: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastAction, setLastAction] = React.useState("");

    return (
      <div className="relative h-[100dvh] border border-border overflow-hidden bg-background">
        <div className="h-14 border-b border-border px-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 px-3 rounded-md border border-border text-sm hover:bg-accent"
          >
            Open Menu
          </button>
          <span className="text-xs text-muted-foreground">{lastAction ? `Last action: ${lastAction}` : "No action selected"}</span>
        </div>
        <div className="p-4 text-sm text-muted-foreground">Thread workspace content area</div>

        <LeftSidebarMenu
          isOpen={open}
          onClose={() => setOpen(false)}
          placement="chat"
          items={items}
          onSelectMode={(id) => {
            setLastAction(id);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const ChatPlacementConstrainedShell: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastAction, setLastAction] = React.useState("");

    return (
      <div className="h-[100dvh] bg-muted/20 p-3">
        <div className="h-full overflow-hidden rounded-lg border border-border bg-background">
          <div className="h-full grid grid-cols-[64px_320px_1fr]">
            <aside className="border-r border-border bg-card" />
            <aside className="border-r border-border p-4 text-sm text-muted-foreground">Thread list</aside>
            <section className="relative min-h-0">
              <div className="h-14 border-b border-border px-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="h-10 px-3 rounded-md border border-border text-sm hover:bg-accent"
                >
                  Open Chat Menu
                </button>
                <span className="text-xs text-muted-foreground">{lastAction ? `Last action: ${lastAction}` : "No action selected"}</span>
              </div>
              <div className="p-4 text-sm text-muted-foreground">Constrained chat shell content area</div>

              <LeftSidebarMenu
                isOpen={open}
                onClose={() => setOpen(false)}
                placement="chat"
                items={items}
                onSelectMode={(id) => {
                  setLastAction(id);
                  setOpen(false);
                }}
              />
            </section>
          </div>
        </div>
      </div>
    );
  },
};

export const AppShellPlacement: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastAction, setLastAction] = React.useState("");

    return (
      <div className="h-[100dvh] bg-background">
        <div className="h-14 border-b border-border px-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 px-3 rounded-md border border-border text-sm hover:bg-accent"
          >
            Open App Menu
          </button>
          <span className="text-xs text-muted-foreground">{lastAction ? `Last action: ${lastAction}` : "No action selected"}</span>
        </div>
        <div className="p-4 text-sm text-muted-foreground">Full-page app-shell scenario.</div>

        <LeftSidebarMenu
          isOpen={open}
          onClose={() => setOpen(false)}
          placement="app-shell"
          items={items}
          onSelectMode={(id) => {
            setLastAction(id);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const WorkspacePlacement: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastAction, setLastAction] = React.useState("");

    return (
      <div className="relative h-[100dvh] border border-border overflow-hidden bg-background">
        <div className="h-14 border-b border-border px-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 px-3 rounded-md border border-border text-sm hover:bg-accent"
          >
            Open Workspace Menu
          </button>
          <span className="text-xs text-muted-foreground">{lastAction ? `Last action: ${lastAction}` : "No action selected"}</span>
        </div>
        <div className="p-4 text-sm text-muted-foreground">Workspace content area with dimmed overlay when menu opens.</div>

        <LeftSidebarMenu
          isOpen={open}
          onClose={() => setOpen(false)}
          placement="workspace"
          items={items}
          onSelectMode={(id) => {
            setLastAction(id);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};
