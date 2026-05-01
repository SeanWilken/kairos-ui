import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { ChatThreadArea, type ChatMessage, type ChatParticipant } from "../src";

const participants: ChatParticipant[] = [
  { id: "arch", name: "Architect", role: "Architecture", avatarColor: "#0e7490" },
  { id: "sec", name: "SecurityReviewer", role: "Security", avatarColor: "#7c2d12" },
];

const baseMessages: ChatMessage[] = [
  { id: "m-1", role: "user", content: "Can we review API risks before rollout?", timestamp: new Date("2026-04-26T09:02:00") },
  { id: "m-2", role: "participant", participantId: "arch", content: "I see two scaling constraints around retries and fan-out.", timestamp: new Date("2026-04-26T09:04:00") },
];

const meta = {
  title: "Chat/Thread Area",
  component: ChatThreadArea,
  tags: ["autodocs"],
} satisfies Meta<typeof ChatThreadArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [messages, setMessages] = React.useState(baseMessages);
    return (
      <div className="h-[620px] border border-border rounded-lg overflow-hidden">
        <ChatThreadArea
          participants={participants}
          messages={messages}
          inputActions={[
            {
              id: "focus",
              label: "Focus Group",
              description: "Open a private agent sub-thread and return synthesis.",
              prefix: "/focus @Architect @SecurityReviewer Goal: ",
            },
            {
              id: "flow",
              label: "Run Workflow",
              description: "Trigger a named orchestrated workflow.",
              prefix: "/flow policy_review",
            },
          ]}
          onSendMessage={(value) => {
            setMessages((current) => [
              ...current,
              { id: `u-${Date.now()}`, role: "user", content: value, timestamp: new Date() },
            ]);
          }}
        />
      </div>
    );
  },
};
