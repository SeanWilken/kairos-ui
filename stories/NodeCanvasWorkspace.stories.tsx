import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import NodeCanvas from "../src/components/NodeCanvas";
import { KnowledgeNode } from "../src/types";

const meta = {
  title: "Workspaces/Node Workspace",
  component: NodeCanvas,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-[90vh] min-h-[90vh] w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    nodes: [
      {
        id: "central-1",
        type: "central",
        content: "A visual knowledge index for AI agents",
        title: "Central Concept",
        position: { x: 560, y: 320 },
        tags: [],
      },
      {
        id: "raw-1",
        type: "raw",
        content: "Agents need a map before they search",
        position: { x: 300, y: 150 },
        tags: ["AI Context"],
      },
      {
        id: "raw-2",
        type: "raw",
        content: "Describe data shape without exposing data",
        position: { x: 980, y: 190 },
        tags: ["Product"],
      },
    ],
    onNodeMove: () => undefined,
    onNodeSelect: () => undefined,
    onNodeUpdate: () => undefined,
    selectedNodeId: null,
  },
  argTypes: {
    nodes: [],
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        height: "90vh",
      },
    },
  },
} satisfies Meta<typeof NodeCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

function NodeCanvasWorkspaceStory() {
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [canvasNodes, setCanvasNodes] = React.useState<KnowledgeNode[]>([
    {
      id: 'central-1',
      type: 'central',
      content: 'A visual knowledge index for AI agents',
      title: 'Central Concept',
      position: { x: 560, y: 320 },
      tags: []
    },
    {
      id: 'raw-1',
      type: 'raw',
      content: 'Agents need a map before they search',
      position: { x: 300, y: 150 },
      tags: ['AI Context']
    },
    {
      id: 'raw-2',
      type: 'raw',
      content: 'Describe data shape without exposing data',
      position: { x: 980, y: 190 },
      tags: ['Product']
    },
    {
      id: 'raw-3',
      type: 'raw',
      content: 'Human-defined relationships',
      position: { x: 380, y: 470 },
      tags: ['UX']
    },
    {
      id: 'raw-4',
      type: 'raw',
      content: 'Metadata-first context',
      position: { x: 730, y: 560 },
      tags: ['AI Context']
    },
    {
      id: 'raw-5',
      type: 'raw',
      content: 'Reduce token bloat',
      position: { x: 180, y: 300 },
      tags: ['Product']
    },
    {
      id: 'raw-6',
      type: 'raw',
      content: 'Glossary for business language',
      position: { x: 920, y: 390 },
      tags: ['Requirement']
    }
  ]);
  
  const handleMoveNode = (id: string, position: { x: number; y: number }) => {
    setCanvasNodes((current) => current.map((n) => (n.id === id ? { ...n, position } : n)));
  };

  return (
    <NodeCanvas 
      nodes={canvasNodes}
      onNodeMove={handleMoveNode}
      onNodeSelect={setSelectedNodeId}
      onNodeUpdate={(id, updates) => {
        setCanvasNodes((current) => current.map((node) => (node.id === id ? { ...node, ...updates } : node)));
      }}
      selectedNodeId={selectedNodeId}
    />
  );

};


export const NodeCanvasWorkspace: Story = {
  render: () => 
    <div className="h-[90vh] min-h-[90vh] w-full">
      <NodeCanvasWorkspaceStory />
    </div>
};
