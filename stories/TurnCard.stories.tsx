import type { Meta, StoryObj } from "@storybook/react";
import { Image } from "lucide-react";

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
  title: "Components/Thread Post Card",
  component: TurnCard,
  tags: ["autodocs"],
  argTypes: {
    contentFormat: {
      control: "radio",
      options: ["text", "markdown"],
      description: "Render message content as plain text or markdown.",
    },
    renderMessageContent: {
      control: false,
      description:
        "Optional custom renderer. When provided, this overrides built-in `text`/`markdown` rendering and receives the full message object.",
      table: {
        type: { summary: "(message: Message) => React.ReactNode" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Use `contentFormat=\"markdown\"` for built-in markdown/image rendering, or `renderMessageContent` for full custom rendering (attachments, embeds, syntax highlighting, etc).",
      },
    },
  },
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

export const MarkdownAndImages: Story = {
  render: () => (
    <div className="max-w-3xl border border-border rounded-lg p-4 bg-background">
      <TurnCard
        contentFormat="markdown"
        persona={persona}
        message={{
          id: "m-3",
          role: "persona",
          personaId: "arch",
          timestamp: new Date("2026-05-04T10:08:00"),
          content:
            "## Plan\n- **Ship** phased rollout\n- Add `retry_limit=3` and queue backpressure\n- See [incident notes](https://example.com/incidents)\n\n![System diagram](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900)",
        }}
      />
    </div>
  ),
};

export const CustomRenderer: Story = {
  render: () => (
    <div className="max-w-3xl border border-border rounded-lg p-4 bg-background">
      <TurnCard
        persona={persona}
        message={{
          id: "m-4",
          role: "persona",
          personaId: "arch",
          timestamp: new Date("2026-05-04T10:12:00"),
          content: "rendered by custom pipeline",
        }}
        renderMessageContent={(msg) => (
          <div className="space-y-3">
            <p className="text-sm">{msg.content}</p>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="mb-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Image className="h-3.5 w-3.5" />
                Attachment preview
              </div>
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900"
                alt="Attachment preview"
                className="max-h-72 w-full rounded-md object-cover"
              />
            </div>
          </div>
        )}
      />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<TurnCard
  message={message}
  renderMessageContent={(msg) => (
    <MyRichRenderer content={msg.content} attachments={msg.citations} />
  )}
/>`,
      },
    },
  },
};
