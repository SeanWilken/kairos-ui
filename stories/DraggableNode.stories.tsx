import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import DraggableNode from "../src/components/DraggableNode";
import ConnectionLines from "../src/components/ConnectionLines";
import type { KnowledgeNode } from "../src/types";

const meta = {
  title: "Components/Draggable Node",
  component: DraggableNode,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        height: "560px",
      },
    },
  },
} satisfies Meta<typeof DraggableNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [node, setNode] = React.useState<KnowledgeNode>({
      id: "raw-1",
      type: "raw",
      content: "Agents need context before retrieval.",
      position: { x: 120, y: 120 },
      tags: ["AI", "Context"],
    });
    const [selected, setSelected] = React.useState(false);

    return (
      <div className="relative h-[520px] rounded-lg border border-border bg-neutral-50">
        <DraggableNode
          node={node}
          zoom={1}
          isSelected={selected}
          onSelect={() => setSelected(true)}
          onMove={(_, position) => setNode((current) => ({ ...current, position }))}
        />
      </div>
    );
  },
};

export const WithRelationships: Story = {
  render: () => {
    const [nodes, setNodes] = React.useState<KnowledgeNode[]>([
      { id: "central-1", type: "central", content: "Central concept", title: "Central", position: { x: 380, y: 220 } },
      {
        id: "raw-1",
        type: "raw",
        content: "Agents need context before retrieval.",
        position: { x: 120, y: 120 },
        tags: ["AI", "Context"],
        relationships: [{ targetId: "raw-2", label: "depends" }],
      },
      { id: "raw-2", type: "raw", content: "Describe data shape", position: { x: 660, y: 300 }, tags: ["Product"] },
    ]);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    return (
      <div className="relative h-[620px] rounded-lg border border-border bg-neutral-50">
        <ConnectionLines nodes={nodes} />
        {nodes.map((node) => (
          <DraggableNode
            key={node.id}
            node={node}
            zoom={1}
            isSelected={selectedId === node.id}
            onSelect={(id) => setSelectedId(id)}
            onMove={(id, position) =>
              setNodes((current) => current.map((entry) => (entry.id === id ? { ...entry, position } : entry)))
            }
          />
        ))}
      </div>
    );
  },
};
