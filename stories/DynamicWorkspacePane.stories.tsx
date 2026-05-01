import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar, FileSearch, MessageSquareText } from "lucide-react";

import {
  DynamicWorkspacePane,
  type DynamicWorkspacePaneOption,
} from "../src";

const optionMap: Record<string, DynamicWorkspacePaneOption> = {
  "thread-alex": {
    id: "thread-alex",
    title: "Thread: Alex Chen",
    description: "Load related chat thread context",
    icon: <MessageSquareText className="w-4 h-4" />,
    groupId: "thread-alex",
  },
  audit: {
    id: "audit",
    title: "Audit Review",
    description: "Reasoning trace and evidence",
    icon: <FileSearch className="w-4 h-4" />,
    groupId: "thread-alex",
  },
  meetings: {
    id: "meetings",
    title: "Meetings",
    description: "Open meetings component",
    icon: <Calendar className="w-4 h-4" />,
  },
};

const meta = {
  title: "Chat/Dynamic Workspace Pane",
  component: DynamicWorkspacePane,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DynamicWorkspacePane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [lastAction, setLastAction] = React.useState("");

    return (
      <div className="h-[520px] border border-border rounded-lg overflow-hidden">
        <DynamicWorkspacePane
          optionMap={optionMap}
          optionKeys={["thread-alex", "audit", "meetings"]}
          onRequestCustomLoad={() => setLastAction("custom-loader")}
          renderLoaded={(option) => (
            <div className="h-full p-4 text-sm">
              Loaded pane content for: <strong>{option.title}</strong>
            </div>
          )}
          onReset={() => setLastAction("reset")}
        />
        {lastAction ? <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">Last action: {lastAction}</div> : null}
      </div>
    );
  },
};
