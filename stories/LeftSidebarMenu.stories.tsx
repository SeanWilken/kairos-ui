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
  title: "Chat/Left Sidebar Menu",
  component: LeftSidebarMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof LeftSidebarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChatPlacement: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastAction, setLastAction] = React.useState("");

    return (
      <div className="relative h-[520px] border border-border rounded-lg overflow-hidden bg-background">
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
