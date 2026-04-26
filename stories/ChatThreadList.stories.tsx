import type { Meta, StoryObj } from "@storybook/react";

import {
  ChatThreadList,
  type ChatThreadItem,
  type ChatThreadParticipant,
} from "../src";

const participants: ChatThreadParticipant[] = [
  { id: "pm-1", name: "Alex Chen", avatarColor: "#0e7490" },
  { id: "dev-1", name: "Jordan Kim", avatarColor: "#4338ca" },
  { id: "qa-1", name: "Riley Brooks", avatarColor: "#b45309" },
  { id: "design-1", name: "Morgan Diaz", avatarColor: "#be185d" },
];

const threads: ChatThreadItem[] = [
  {
    id: "room-1",
    name: "Sprint Planning Council",
    type: "room",
    participantIds: ["pm-1", "dev-1", "qa-1", "design-1"],
    lastMessage: "Ship bulk edits as MVP this sprint behind rollout controls",
    lastMessageTime: new Date("2026-04-26T09:12:00"),
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: "assistant-1",
    name: "Your Assistant",
    type: "assistant",
    participantIds: ["pm-1"],
    lastMessage: "I can draft the rollout checklist from this thread.",
    lastMessageTime: new Date("2026-04-26T08:41:00"),
  },
  {
    id: "direct-1",
    name: "Alex Chen",
    type: "direct",
    participantIds: ["pm-1"],
    lastMessage: "Can you review the release checklist?",
    lastMessageTime: new Date("2026-04-25T15:20:00"),
  },
];

const meta = {
  title: "Chat/Thread List",
  component: ChatThreadList,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChatThreadList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[100dvh]">
      <ChatThreadList
        threads={threads}
        participants={participants}
        selectedThreadId="room-1"
        onSelectThread={() => {}}
      />
    </div>
  ),
};
