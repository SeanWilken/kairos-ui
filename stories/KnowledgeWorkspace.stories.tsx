import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import "@xyflow/react/dist/style.css";

import { KnowledgeWorkspace } from "../src/components/KnowledgeWorkspace";
import { KnowledgeGraphCanvas } from "../src/components/KnowledgeGraphCanvas";
import { NodeDetailPanel } from "../src/components/NodeDetailPanel";
import { KnowledgeIndexPanel } from "../src/components/KnowledgeIndexPanel";
import { TagEditor } from "../src/components/TagEditor";
import { FederatedSourceBadge } from "../src/components/FederatedSourceBadge";
import type { KnowledgeGraphData, KnowledgeGraphNode as KnowledgeNode, KnowledgeTag } from "../src/types/knowledge";

const SAMPLE_DATA: KnowledgeGraphData = {
  nodes: [
    {
      id: "n1",
      type: "document",
      title: "Q4 2025 Strategy Brief",
      summary: "Executive summary of the Q4 growth strategy across all product lines.",
      tags: [{ id: "t1", label: "strategy" }, { id: "t2", label: "Q4" }],
      source: { id: "s1", name: "Confluence", type: "api", syncedAt: "2026-05-16" },
      createdAt: "2026-01-10",
      confidence: 0.92,
    },
    {
      id: "n2",
      type: "concept",
      title: "Federated Knowledge Graph",
      summary: "Architecture pattern for aggregating heterogeneous data sources into a unified graph.",
      tags: [{ id: "t3", label: "architecture" }, { id: "t4", label: "graph" }],
      source: { id: "s2", name: "Internal Wiki", type: "database", syncedAt: "2026-05-14" },
      createdAt: "2026-02-03",
      confidence: 0.87,
    },
    {
      id: "n3",
      type: "decision",
      title: "Adopt React Flow for graph rendering",
      summary: "Team decision to use @xyflow/react for the KnowLedger graph canvas over D3 alternatives.",
      tags: [{ id: "t5", label: "tech-stack" }],
      source: { id: "s3", name: "Notion", type: "web" },
      createdAt: "2026-03-15",
    },
    {
      id: "n4",
      type: "person",
      title: "Sean Wilken",
      summary: "Engineering lead for KnowLedger and kairos-ui.",
      tags: [{ id: "t6", label: "engineering" }],
      source: { id: "s4", name: "Directory", type: "manual" },
      createdAt: "2026-01-01",
    },
    {
      id: "n5",
      type: "action",
      title: "Write KnowledgeWorkspace Storybook story",
      summary: "Document the full workspace with realistic sample data.",
      tags: [{ id: "t7", label: "docs" }, { id: "t2", label: "Q4" }],
      source: { id: "s5", name: "Linear", type: "api", syncedAt: "2026-05-17" },
      createdAt: "2026-05-17",
    },
    {
      id: "n6",
      type: "evidence",
      title: "React Flow benchmark results",
      summary: "Performance data showing React Flow handles 500+ nodes at 60fps on modern hardware.",
      tags: [{ id: "t5", label: "tech-stack" }, { id: "t8", label: "performance" }],
      source: { id: "s1", name: "Confluence", type: "api", syncedAt: "2026-05-10" },
      createdAt: "2026-03-10",
      confidence: 0.95,
    },
    {
      id: "n7",
      type: "question",
      title: "How should we handle real-time graph updates?",
      summary: "Should the graph subscribe via WebSocket or poll from the core API?",
      tags: [{ id: "t3", label: "architecture" }],
      source: { id: "s2", name: "Internal Wiki", type: "database" },
      createdAt: "2026-04-02",
    },
    {
      id: "n8",
      type: "hypothesis",
      title: "WebSocket subscriptions will reduce latency by 80%",
      summary: "Based on prior work in the Rooms feature, real-time subscriptions outperform polling significantly.",
      tags: [{ id: "t3", label: "architecture" }, { id: "t8", label: "performance" }],
      source: { id: "s4", name: "Directory", type: "manual" },
      createdAt: "2026-04-05",
      confidence: 0.7,
    },
    {
      id: "n9",
      type: "index",
      title: "KnowLedger Architecture Index",
      summary: "Top-level index of all architectural decisions, concepts, and open questions.",
      tags: [{ id: "t3", label: "architecture" }],
      source: { id: "s2", name: "Internal Wiki", type: "database" },
      createdAt: "2026-02-01",
    },
  ],
  relations: [
    { id: "r1", sourceId: "n1", targetId: "n2", type: "references" },
    { id: "r2", sourceId: "n6", targetId: "n3", type: "supports" },
    { id: "r3", sourceId: "n3", targetId: "n2", type: "extends" },
    { id: "r4", sourceId: "n4", targetId: "n3", type: "authored_by" },
    { id: "r5", sourceId: "n5", targetId: "n3", type: "references" },
    { id: "r6", sourceId: "n7", targetId: "n1", type: "references" },
    { id: "r7", sourceId: "n8", targetId: "n7", type: "supports" },
    { id: "r8", sourceId: "n9", targetId: "n2", type: "indexed_by" },
    { id: "r9", sourceId: "n9", targetId: "n3", type: "indexed_by" },
    { id: "r10", sourceId: "n9", targetId: "n7", type: "indexed_by" },
  ],
};

const meta: Meta<typeof KnowledgeWorkspace> = {
  title: "Knowledge/KnowledgeWorkspace",
  component: KnowledgeWorkspace,
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "Full-page knowledge graph workspace with index, canvas, and detail panels." } },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KnowledgeWorkspace>;

export const Default: Story = {
  render: () => {
    const [data, setData] = React.useState(SAMPLE_DATA);
    const [selectedNodeId, setSelectedNodeId] = React.useState<string | undefined>();

    const handleAddTag = (nodeId: string, label: string) => {
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === nodeId
            ? { ...n, tags: [...n.tags, { id: `tag-${Date.now()}`, label }] }
            : n
        ),
      }));
    };

    const handleRemoveTag = (nodeId: string, tagId: string) => {
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === nodeId ? { ...n, tags: n.tags.filter((t) => t.id !== tagId) } : n
        ),
      }));
    };

    return (
      <div style={{ height: "100vh" }}>
        <KnowledgeWorkspace
          data={data}
          title="KnowLedger"
          selectedNodeId={selectedNodeId}
          onNodeSelect={(node) => setSelectedNodeId(node?.id)}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onChatAbout={(node) => console.log("Chat about:", node.title)}
          onAddNode={() => console.log("Add node")}
          onEditNode={(node) => console.log("Edit:", node.title)}
        />
      </div>
    );
  },
};

export const GraphOnly: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <KnowledgeGraphCanvas
        data={SAMPLE_DATA}
        showMinimap
        onNodeSelect={(node) => console.log("Selected:", node?.title)}
      />
    </div>
  ),
  parameters: { docs: { description: { story: "Standalone graph canvas without index or detail panels." } } },
};

export const IndexPanel: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | undefined>();
    return (
      <div style={{ height: "100vh", display: "flex" }}>
        <div style={{ width: 280, height: "100%" }}>
          <KnowledgeIndexPanel
            nodes={SAMPLE_DATA.nodes}
            selectedNodeId={selectedId}
            onNodeSelect={(n) => setSelectedId(n.id)}
          />
        </div>
        <div className="flex-1 p-8 bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Selected: {selectedId ? SAMPLE_DATA.nodes.find((n) => n.id === selectedId)?.title ?? "—" : "—"}
          </p>
        </div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Left index panel with search, tag filtering, source filtering, and grouped node list." } } },
};

export const DetailPanel: Story = {
  render: () => {
    const node = SAMPLE_DATA.nodes[0];
    const relations = SAMPLE_DATA.relations.filter(
      (r) => r.sourceId === node.id || r.targetId === node.id
    );
    const [tags, setTags] = React.useState(node.tags);

    return (
      <div style={{ height: "100vh", display: "flex" }}>
        <div className="flex-1 bg-muted/20 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Graph canvas area</p>
        </div>
        <div style={{ width: 340, height: "100%" }}>
          <NodeDetailPanel
            node={{ ...node, tags }}
            relations={relations}
            allNodes={SAMPLE_DATA.nodes}
            onAddTag={(_, label) => setTags((t) => [...t, { id: `tag-${Date.now()}`, label }])}
            onRemoveTag={(_, tagId) => setTags((t) => t.filter((x) => x.id !== tagId))}
            onChatAbout={(n) => console.log("Chat about:", n.title)}
            onEdit={(n) => console.log("Edit:", n.title)}
            onNavigate={(id) => console.log("Navigate to:", id)}
          />
        </div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Right detail panel showing node metadata, tags, relations, and actions." } } },
};

export const TagEditorStory: Story = {
  name: "TagEditor",
  render: () => {
    const [tags, setTags] = React.useState<KnowledgeTag[]>([
      { id: "1", label: "strategy" },
      { id: "2", label: "Q4", color: "#3b82f6" },
    ]);
    return (
      <div className="p-8">
        <p className="text-sm font-medium mb-3">Interactive TagEditor</p>
        <TagEditor
          tags={tags}
          onAddTag={(label) => setTags((t) => [...t, { id: `${Date.now()}`, label }])}
          onRemoveTag={(id) => setTags((t) => t.filter((x) => x.id !== id))}
        />
      </div>
    );
  },
};

export const SourceBadges: Story = {
  name: "FederatedSourceBadge",
  render: () => (
    <div className="p-8 space-y-4">
      <p className="text-sm font-medium mb-3">Federated Source Badges</p>
      <div className="flex flex-wrap gap-2">
        {(["api", "database", "file", "web", "manual"] as const).map((type) => (
          <FederatedSourceBadge
            key={type}
            source={{ id: type, name: type === "api" ? "Confluence" : type === "database" ? "PostgreSQL" : type === "file" ? "uploads/brief.pdf" : type === "web" ? "notion.so" : "Manual entry", type, syncedAt: "2026-05-16" }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <p className="text-xs text-muted-foreground w-full">Compact variant</p>
        {(["api", "database", "file", "web", "manual"] as const).map((type) => (
          <FederatedSourceBadge
            key={type}
            compact
            source={{ id: type, name: type === "api" ? "Confluence" : type === "database" ? "PostgreSQL" : type === "file" ? "uploads/brief.pdf" : type === "web" ? "Notion" : "Manual", type }}
          />
        ))}
      </div>
    </div>
  ),
};
