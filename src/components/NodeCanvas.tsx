import { Bot, CheckCheck, Copy, Focus, Grid, Lightbulb, ListChecks, MessageCircleQuestion, MoveDiagonal2, ZoomIn, ZoomOut } from 'lucide-react';
import { KnowledgeNode } from '../types';
import DraggableNode from './DraggableNode';
import AIAssistPanel from './AssistPanel';
import ConnectionLines from './ConnectionLines';
import DraggableCanvas from './DraggableCanvas';

export interface NodeCanvasProps {
  nodes: KnowledgeNode[];
  onNodeMove: (id: string, position: { x: number; y: number }) => void;
  onNodeSelect: (id: string | null) => void;
  onNodeUpdate: (id: string, updates: Partial<KnowledgeNode>) => void;
  selectedNodeId: string | null;
}

export default function NodeCanvas({
  nodes,
  onNodeMove,
  onNodeSelect,
  onNodeUpdate: _onNodeUpdate,
  selectedNodeId
}: NodeCanvasProps) {
  const handleAutoArrange = () => {
    if (nodes.length === 0) return;
    const columns = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
    const spacingX = 320;
    const spacingY = 210;
    const startX = 140;
    const startY = 120;

    nodes.forEach((node, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      onNodeMove(node.id, {
        x: startX + col * spacingX,
        y: startY + row * spacingY,
      });
    });
  };

  return (
    <DraggableCanvas
      className="relative h-full min-h-[78vh] w-full overflow-hidden bg-neutral-50"
      showControls
      onBackgroundClick={() => onNodeSelect(null)}
      onArrange={handleAutoArrange}
      renderControls={({ zoomIn, zoomOut, fitView, arrange }) => (
        <div className="absolute bottom-6 right-20 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          <div className="flex flex-col gap-1">
            <button className="rounded p-2 transition-colors hover:bg-neutral-50" title="Zoom In" type="button" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4 text-neutral-600" />
            </button>
            <button className="rounded p-2 transition-colors hover:bg-neutral-50" title="Zoom Out" type="button" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4 text-neutral-600" />
            </button>
            <div className="my-1 h-px bg-neutral-200" />
            <button className="rounded p-2 transition-colors hover:bg-neutral-50" title="Fit" type="button" onClick={fitView}>
              <Focus className="h-4 w-4 text-neutral-600" />
            </button>
            <button className="rounded p-2 transition-colors hover:bg-neutral-50" title="Auto grid" type="button" onClick={arrange}>
              <Grid className="h-4 w-4 text-neutral-600" />
            </button>
          </div>
        </div>
      )}
      overlay={
        <>
          <AIAssistPanel
            icon={Bot}
            panelTitle="Shape the Noise"
            panelControls={[
              { icon: Lightbulb, label: "Suggest clusters", action: () => ({}) },
              { icon: Copy, label: "Find duplicate ideas", action: () => ({}) },
              { icon: CheckCheck, label: "Identify dependencies", action: () => ({}) },
              { icon: ListChecks, label: "Pull out requirements", action: () => ({}) },
              { icon: MessageCircleQuestion, label: "Create questions", action: () => ({}) },
              { icon: MoveDiagonal2, label: "Move weak ideas to backburner", action: () => ({}) },
            ]}
          />
        </>
      }
    >
      {({ zoom }) => (
        <>
        <ConnectionLines nodes={nodes} />

        {nodes.map(node => (
          <DraggableNode
            key={node.id}
            node={node}
            onMove={onNodeMove}
            onSelect={onNodeSelect}
            isSelected={selectedNodeId === node.id}
            zoom={zoom}
          />
        ))}
        </>
      )}
    </DraggableCanvas>
  );
}
