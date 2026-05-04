import type { Meta, StoryObj } from "@storybook/react";

import { TurnCard, type Message, type Persona } from "../src";

const persona: Persona = {
  id: "arch",
  name: "Architect",
  role: "Senior Dev",
  description: "System design reviewer",
  avatarColor: "#0e7490",
};

const message: Message = {
  id: "m-1",
  role: "persona",
  personaId: "arch",
  content: "I recommend a phased rollout with strict telemetry gates and retry circuit limits.",
  timestamp: new Date("2026-05-04T10:05:00"),
  status: "thinking",
  confidence: 0.87,
  citations: [
    { id: "c1", source: "Incident notes", text: "Prior retries caused fan-out overload" },
    { id: "c2", source: "Load test", text: "p95 rises beyond threshold at 35% rollout" },
  ],
};

const meta = {
  title: "Chat/Turn Card",
  component: TurnCard,
  tags: ["autodocs"],
} satisfies Meta<typeof TurnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PersonaTurn: Story = {
  render: () => (
    <div className="max-w-3xl border border-border rounded-lg p-4 bg-background">
      <TurnCard message={message} persona={persona} />
    </div>
  ),
};

export const UserTurn: Story = {
  render: () => (
    <div className="max-w-3xl border border-border rounded-lg p-4 bg-background">
      <TurnCard
        message={{
          id: "m-2",
          role: "user",
          content: "Can you summarize the risk tradeoffs by noon?",
          timestamp: new Date("2026-05-04T10:06:00"),
        }}
      />
    </div>
  ),
};
