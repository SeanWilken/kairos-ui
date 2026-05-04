import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CalendarDays, FileText } from "lucide-react";

import {
  ActionItemRow,
  Calendar,
  DecisionCard,
  ParticipantChip,
} from "../src";
import { ChatThreadArea } from "../src/components/ChatThreadArea";
import { paneActionItems, paneDecisions, paneMessages, paneParticipants } from "./paneAreaFixtures";

const meta = {
  title: "Chat/Pane Areas",
  component: ChatThreadArea,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChatThreadArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreadArea: Story = {
  render: () => {
    const [mode, setMode] = React.useState("ask");
    const [responseMode, setResponseMode] = React.useState("balanced");
    return (
      <div className="h-[640px] border border-border rounded-lg overflow-hidden">
        <ChatThreadArea
          participants={paneParticipants}
          messages={paneMessages}
          placeholder="Message thread..."
          mode={mode}
          modeOptions={["ask", "decide", "plan", "execute"]}
          onModeChange={setMode}
          responseMode={responseMode}
          responseModeOptions={["fast", "thinking", "balanced"]}
          onResponseModeChange={setResponseMode}
        />
      </div>
    );
  },
};

export const ParticipantsArea: Story = {
  render: () => (
    <div className="h-[640px] border border-border rounded-lg p-4 space-y-2 overflow-auto bg-background">
      {paneParticipants.map((participant) => (
        <ParticipantChip
          key={participant.id}
          persona={{
            id: participant.id,
            name: participant.name,
            role: participant.role,
            description: "",
            avatarColor: participant.avatarColor,
          }}
        />
      ))}
    </div>
  ),
};

export const ActionsArea: Story = {
  render: () => (
    <div className="h-[640px] border border-border rounded-lg p-4 space-y-2 overflow-auto bg-background">
      {paneActionItems.map((item) => (
        <ActionItemRow key={item.id} item={item} resolvePersona={(id) => paneParticipants.find((p) => p.id === id)} />
      ))}
    </div>
  ),
};

export const DecisionsArea: Story = {
  render: () => (
    <div className="h-[640px] border border-border rounded-lg p-4 space-y-3 overflow-auto bg-background">
      {paneDecisions.map((decision) => (
        <DecisionCard key={decision.id} decision={decision} resolvePersona={(id) => paneParticipants.find((p) => p.id === id)} />
      ))}
    </div>
  ),
};

export const DocumentsArea: Story = {
  render: () => (
    <div className="h-[640px] border border-border rounded-lg p-4 bg-background">
      <div className="h-full rounded-lg border border-dashed border-border p-6 flex flex-col items-center justify-center text-center">
        <FileText className="w-8 h-8 mb-3 text-muted-foreground" />
        <h4 className="mb-1">Documents Viewer</h4>
        <p className="text-sm text-muted-foreground max-w-sm">Load PDFs, policy docs, and supporting artifacts used by RAG and review workflows.</p>
      </div>
    </div>
  ),
};

export const CalendarArea: Story = {
  render: () => (
    <div className="h-[640px] border border-border rounded-lg p-4 bg-background">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="w-4 h-4" />
        Schedule and timeline
      </div>
      <div className="rounded-lg border border-border p-3 w-fit">
        <Calendar mode="single" selected={new Date("2026-04-28T00:00:00")} />
      </div>
    </div>
  ),
};
