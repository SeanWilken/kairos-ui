import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MessageInteractionMenu } from "../src";

const meta = {
  title: "Chat/Message Interaction Menu",
  component: MessageInteractionMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof MessageInteractionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 280, y: 220 });
    const [lastAction, setLastAction] = React.useState("");

    return (
      <div className="h-[520px] border border-border rounded-lg bg-background relative p-6">
        <div className="max-w-xl space-y-3">
          <h4>Message</h4>
          <p className="text-sm text-muted-foreground">Right-click simulation for contextual interaction actions.</p>
          <button
            type="button"
            className="px-3 py-2 rounded-md border border-border text-sm hover:bg-accent"
            onClick={(event) => {
              const rect = (event.target as HTMLButtonElement).getBoundingClientRect();
              setPosition({ x: rect.left + 20, y: rect.bottom + 8 });
              setOpen(true);
            }}
          >
            Open Message Menu
          </button>
          <div className="text-xs text-muted-foreground">{lastAction ? `Last action: ${lastAction}` : "No action selected"}</div>
        </div>

        <MessageInteractionMenu
          isOpen={open}
          position={position}
          messageId="message-123"
          onClose={() => setOpen(false)}
          onAction={(action) => {
            setLastAction(action);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};
