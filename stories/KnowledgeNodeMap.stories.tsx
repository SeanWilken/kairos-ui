import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { KnowledgeNodeMap, NodeDetailsPane, defaultKnowledgeMapNodes, type KnowledgeNode } from "../src";

const meta = {
  title: "Workspaces/Knowledge Node Map",
  component: KnowledgeNodeMap,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-[90vh] min-h-[90vh] w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    nodes: defaultKnowledgeMapNodes,
    selectedNodeId: null,
    onNodeSelect: () => undefined,
    onNodeMove: () => undefined,
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
} satisfies Meta<typeof KnowledgeNodeMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[90vh] min-h-[90vh] border border-border">
      <KnowledgeNodeMapStory />
    </div>
  ),
};

export const WithDocumentDetails: Story = {
  render: () => <KnowledgeNodeDocumentStory />,
};

function KnowledgeNodeMapStory() {
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [nodes, setNodes] = React.useState<KnowledgeNode[]>(defaultKnowledgeMapNodes);

  const handleNodeMove = (id: string, position: { x: number; y: number }) => {
    setNodes((current) => current.map((node) => (node.id === id ? { ...node, position } : node)));
  };

  return (
    <KnowledgeNodeMap
      nodes={nodes}
      selectedNodeId={selectedNodeId}
      onNodeSelect={setSelectedNodeId}
      onNodeMove={handleNodeMove}
    />
  );
}

function KnowledgeNodeDocumentStory() {
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(defaultKnowledgeMapNodes[1]?.id ?? null);
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string | null>(null);
  const [nodes, setNodes] = React.useState<KnowledgeNode[]>(defaultKnowledgeMapNodes);
  const [panelPosition, setPanelPosition] = React.useState({ x: 0, y: 0 });
  const dragState = React.useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const handleNodeMove = (id: string, position: { x: number; y: number }) => {
    setNodes((current) => current.map((node) => (node.id === id ? { ...node, position } : node)));
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const active = dragState.current;
      if (!active) return;
      setPanelPosition({
        x: active.originX + (event.clientX - active.startX),
        y: active.originY + (event.clientY - active.startY),
      });
    };

    const handleMouseUp = () => {
      dragState.current = null;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="relative h-[90vh] min-h-[90vh]">
      <div className="h-full min-h-0 overflow-hidden rounded-lg border border-border">
        <KnowledgeNodeMap
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onNodeSelect={(id) => {
            setSelectedNodeId(id);
            setSelectedDocumentId(null);
          }}
          onNodeMove={handleNodeMove}
        />
      </div>

      <div
        className="pointer-events-none absolute right-6 top-6 z-30 w-full max-w-sm"
        style={{ transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)` }}
      >
        <div className="pointer-events-auto overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          <div
            className="cursor-move border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground"
            onMouseDown={(event) => {
              dragState.current = {
                startX: event.clientX,
                startY: event.clientY,
                originX: panelPosition.x,
                originY: panelPosition.y,
              };
              document.body.style.userSelect = "none";
            }}
          >
            Drag details panel
          </div>
          <NodeDetailsPane
            className="rounded-none border-0 shadow-none"
            node={selectedNode}
            selectedDocumentId={selectedDocumentId}
            onSelectedDocumentChange={setSelectedDocumentId}
          />
        </div>
      </div>
    </div>
  );
}
