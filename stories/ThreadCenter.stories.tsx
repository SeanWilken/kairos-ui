import type { Meta, StoryObj } from "@storybook/react";

import { ThreadCenter } from "../src";

const meta = {
  title: "Composites/Thread Center",
  component: ThreadCenter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Production-style Council Messages experience composed from Thread List, Turn Cards, Action Menu, audit split view, and right-side participant/action/decision context.\n\nUse `ThreadCenter` as the page component for Council Messages and pair it with persisted workspace/thread DTOs from your API layer.",
      },
    },
  },
} satisfies Meta<typeof ThreadCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MessagePage: Story = {
  parameters: {
    docs: {
      source: {
        code: `import { ThreadCenter } from "@myai/ui";

export default function MessagesPage() {
  return <ThreadCenter />;
}`,
      },
    },
  },
};

export const CouncilIntegration: Story = {
  render: () => (
    <div className="h-[88vh] overflow-auto p-6">
      <div className="mx-auto max-w-4xl space-y-4 rounded-lg border border-border bg-background p-5">
        <h3>How To Use In Council</h3>
        <p className="text-sm text-muted-foreground">
          Mount <code>ThreadCenter</code> for the Messages route, then map your API DTOs for threads/messages/personas/actions/decisions.
        </p>
        <pre className="overflow-auto rounded bg-muted/30 p-4 text-xs">{`// council/src/pages/MessagesPage.tsx
import { ThreadCenter } from "@myai/ui";

export default function MessagesPage() {
  return <ThreadCenter />;
}`}</pre>
        <pre className="overflow-auto rounded bg-muted/30 p-4 text-xs">{`// Workspace + thread persistence contract (example)
type WorkspaceRecordDTO = {
  id: string;
  name: string;
  kind: "thread" | "split" | "window";
  threadBinding?: { threadId: string; mode?: string; responseMode?: string };
  state: {
    layout: "canvas" | "split";
    panes: Array<{ id: string; loadOptionId?: string; layout?: { x: number; y: number; width: number; height: number } }>;
  };
};`}</pre>
      </div>
    </div>
  ),
};
