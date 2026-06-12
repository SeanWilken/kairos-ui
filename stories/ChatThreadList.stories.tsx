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
  title: "Components/Thread List",
  component: ChatThreadList,
  tags: ["autodocs"],
  args: {
    title: "Messages",
    description: "Browse rooms and direct conversations",
    showSearch: true,
    showFilters: true,
    collapsible: true,
    collapseOnSelect: true,
  },
  argTypes: {
    title: { control: "text", description: "Header title for the thread list." },
    description: { control: "text", description: "Header helper text under the title." },
    selectedThreadId: { control: "text", description: "Currently selected thread id." },
    showSearch: { control: "boolean", description: "Show/hide search input." },
    showFilters: { control: "boolean", description: "Show/hide filter chips." },
    collapsible: { control: "boolean", description: "Enable collapse controls for sidebar usage." },
    collapseOnSelect: { control: "boolean", description: "Collapse list immediately after selecting a thread." },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Thread list used by Council Messages page. Supports controlled filter/search/collapse state and room/direct/assistant thread variants.",
      },
    },
  },
} satisfies Meta<typeof ChatThreadList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="h-[100dvh] min-h-[100dvh]">
      <ChatThreadList
        className="h-full"
        threads={threads}
        participants={participants}
        selectedThreadId="room-1"
        onSelectThread={() => {}}
      />
    </div>
  ),
};
