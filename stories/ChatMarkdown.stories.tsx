import type { Meta, StoryObj } from "@storybook/react";

import { ChatMarkdown } from "../src";

const meta = {
  title: "Components/Chat Markdown",
  component: ChatMarkdown,
  tags: ["autodocs"],
  args: {
    content:
      "## Rollout Plan\n\nShip behind a staged rollout.\n\n- **Phase 1:** 20% of orgs\n- **Phase 2:** monitor retry failures\n- **Phase 3:** expand after 48h\n\n> Keep the experience readable like chat, not a document page.\n\n```ts\nconst rollout = { percentage: 20, retries: 3 }\n```\n\n| Signal | Target |\n| --- | --- |\n| Error rate | < 1% |\n| Retry success | > 95% |",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Shared chat-safe markdown renderer used by thread surfaces. It keeps markdown compact and readable inside chat layouts without requiring app-level typography overrides.",
      },
    },
  },
} satisfies Meta<typeof ChatMarkdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-3xl rounded-lg border border-border bg-background p-4">
      <ChatMarkdown {...args} />
    </div>
  ),
};
