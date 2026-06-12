import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { ChatWidget, type Message, type Persona, type TurnCardProps } from "../src";

const assistantPersona: Persona = {
  id: "assistant",
  name: "myAI Assistant",
  role: "Support",
  description: "Personal assistant",
  avatarColor: "#2563eb",
};

const starterMessages: Message[] = [
  {
    id: "assistant-1",
    role: "persona",
    personaId: "assistant",
    content: "Hi! I can help with meeting notes, summaries, and daily planning.",
    timestamp: new Date(),
  },
];

const meta = {
  title: "Components/Chat Widget",
  component: ChatWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        height: "88vh",
      },
    },
  },
} satisfies Meta<typeof ChatWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Assistant: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<Message[]>(starterMessages);
    const [draft, setDraft] = React.useState("");
    const [fullscreen, setFullscreen] = React.useState(false);

    const posts: TurnCardProps[] = messages.map((message) => ({
      message,
      persona: message.role === "persona" ? assistantPersona : null,
    }));

    return (
      <div className="h-[560px] relative">
        <ChatWidget
          assistantPersona={assistantPersona}
          posts={posts}
          draft={draft}
          showSettingsButton
          position="bottom-center"
          isFullscreen={fullscreen}
          onDraftChange={setDraft}
          onRefresh={() => undefined}
          onSettingsClick={() => undefined}
          onToggleFullscreen={() => setFullscreen((current) => !current)}
          onClose={() => undefined}
          onSendMessage={(value) => {
            setMessages((current) => [
              ...current,
              { id: `u-${Date.now()}`, role: "user", content: value, timestamp: new Date() },
              { id: `a-${Date.now()}`, role: "persona", personaId: "assistant", content: "Understood — I can help with that.", timestamp: new Date() },
            ]);
            setDraft("");
          }}
        />
      </div>
    );
  },
};
