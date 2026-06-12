import { KnowledgeNode } from '../types';

interface ConnectionLinesProps {
  nodes: KnowledgeNode[];
}

export default function ConnectionLines({ nodes }: ConnectionLinesProps) {
  const centralNode = nodes.find(n => n.type === 'central');
  if (!centralNode) return null;

  const connections: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    label?: string;
  }> = [];

  nodes.forEach(node => {
    if (node.id !== centralNode.id && node.type === 'raw') {
      connections.push({
        from: {
          x: centralNode.position.x + 160,
          y: centralNode.position.y + 50
        },
        to: {
          x: node.position.x + 100,
          y: node.position.y + 20
        }
      });
    }

    if (node.relationships) {
      node.relationships.forEach(rel => {
        const targetNode = nodes.find(n => n.id === rel.targetId);
        if (targetNode) {
          connections.push({
            from: {
              x: node.position.x + 100,
              y: node.position.y + 20
            },
            to: {
              x: targetNode.position.x + 100,
              y: targetNode.position.y + 20
            },
            label: rel.label
          });
        }
      });
    }
  });

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#d1d5db"
          />
        </marker>
      </defs>

      {connections.map((conn, idx) => {
        const dx = conn.to.x - conn.from.x;
        const dy = conn.to.y - conn.from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const curve = Math.min(distance * 0.3, 100);

        const midX = (conn.from.x + conn.to.x) / 2;
        const midY = (conn.from.y + conn.to.y) / 2;

        const path = `M ${conn.from.x} ${conn.from.y} Q ${midX} ${midY - curve} ${conn.to.x} ${conn.to.y}`;

        return (
          <g key={idx}>
            <path
              d={path}
              stroke="#d1d5db"
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity="0.5"
            />
            {conn.label && (
              <text
                x={midX}
                y={midY - curve - 5}
                className="text-xs fill-neutral-400"
                textAnchor="middle"
              >
                {conn.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
