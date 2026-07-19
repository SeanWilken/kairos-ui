import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Badge,
  WhiteboardSurface,
  type WhiteboardItem,
  type WhiteboardStroke,
} from "../src";

const initialStrokes: WhiteboardStroke[] = [
  {
    id: "stroke-1",
    color: "#6366f1",
    width: 2.5,
    points: [[90, 130], [125, 105], [165, 118], [205, 90], [255, 112]],
  },
];

const initialItems: WhiteboardItem[] = [
  {
    id: "note-1",
    kind: "note",
    x: 110,
    y: 180,
    width: 240,
    title: "Knowledge workflow",
    text: "Connect source documents to graph nodes and make generated artifacts available to Council.",
    items: [],
    color: "#fef3c7",
  },
  {
    id: "list-1",
    kind: "list",
    x: 430,
    y: 130,
    width: 220,
    title: "Next steps",
    text: "",
    items: ["Map document contracts", "Review graph interactions", "Publish shared package"],
    color: "#e0e7ff",
  },
];

const meta = {
  title: "Workspaces/Whiteboard",
  component: WhiteboardSurface,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Controlled whiteboard workspace with freehand drawing, click-to-connect straight lines, draggable notes, editable lists, and erase tools. Consuming apps own board persistence and linking through the exported whiteboard contracts.",
      },
      story: {
        inline: false,
        height: "85vh",
      },
    },
  },
} satisfies Meta<typeof WhiteboardSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveWhiteboard() {
  const [strokes, setStrokes] = React.useState(initialStrokes);
  const [items, setItems] = React.useState(initialItems);

  return (
    <div className="min-h-[42rem] bg-background p-4" style={{ height: "100dvh" }}>
      <div className="h-full overflow-hidden rounded-xl border border-border shadow-sm">
        <WhiteboardSurface
          strokes={strokes}
          items={items}
          onAddStroke={(stroke) => setStrokes((current) => [...current, { ...stroke, id: `stroke-${Date.now()}` }])}
          onRemoveStroke={(strokeId) => setStrokes((current) => current.filter((stroke) => stroke.id !== strokeId))}
          onAddItem={(item) => setItems((current) => [...current, { ...item, id: `item-${Date.now()}` }])}
          onUpdateItem={(itemId, updates) => {
            setItems((current) => current.map((item) => item.id === itemId ? { ...item, ...updates } : item));
          }}
          onRemoveItem={(itemId) => setItems((current) => current.filter((item) => item.id !== itemId))}
          toolbarEndSlot={<Badge variant="secondary">Controlled workspace</Badge>}
        />
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveWhiteboard />,
};

export const EmptyBoard: Story = {
  render: () => {
    const [strokes, setStrokes] = React.useState<WhiteboardStroke[]>([]);
    const [items, setItems] = React.useState<WhiteboardItem[]>([]);

    return (
      <div className="min-h-[42rem] bg-background p-4" style={{ height: "100dvh" }}>
        <div className="h-full overflow-hidden rounded-xl border border-border shadow-sm">
          <WhiteboardSurface
            strokes={strokes}
            items={items}
            onAddStroke={(stroke) => setStrokes((current) => [...current, { ...stroke, id: `stroke-${Date.now()}` }])}
            onRemoveStroke={(strokeId) => setStrokes((current) => current.filter((stroke) => stroke.id !== strokeId))}
            onAddItem={(item) => setItems((current) => [...current, { ...item, id: `item-${Date.now()}` }])}
            onUpdateItem={(itemId, updates) => {
              setItems((current) => current.map((item) => item.id === itemId ? { ...item, ...updates } : item));
            }}
            onRemoveItem={(itemId) => setItems((current) => current.filter((item) => item.id !== itemId))}
          />
        </div>
      </div>
    );
  },
};
