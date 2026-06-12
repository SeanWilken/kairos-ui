import { useRef, useEffect, useState } from 'react';
import { KnowledgeNode } from '../types';
import { Edit2, Trash2, Link2 } from 'lucide-react';

interface DraggableNodeProps {
  node: KnowledgeNode;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  zoom: number;
}

export default function DraggableNode({
  node,
  onMove,
  onSelect,
  isSelected,
  zoom
}: DraggableNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;
        onMove(node.id, {
          x: node.position.x + dx,
          y: node.position.y + dy
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, node.position, node.id, onMove, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    onSelect(node.id);
  };

  const getNodeStyle = () => {
    switch (node.type) {
      case 'central':
        return 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 px-8 py-6 min-w-[320px]';
      case 'cluster':
        return 'bg-white border-2 border-neutral-200 px-6 py-4 min-w-[280px]';
      case 'question':
        return 'bg-amber-50 border border-amber-200 px-4 py-3 min-w-[240px]';
      case 'decision':
        return 'bg-green-50 border-2 border-green-300 px-4 py-3 min-w-[240px]';
      case 'backburner':
        return 'bg-neutral-100 border border-neutral-300 px-4 py-3 min-w-[200px] opacity-60';
      default:
        return 'bg-white border border-neutral-200 px-4 py-3 min-w-[200px]';
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute rounded-xl shadow-sm cursor-move transition-all ${getNodeStyle()} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isDragging ? 'shadow-xl scale-105' : 'hover:shadow-md'}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {node.title && (
        <div className="font-medium text-sm text-neutral-900 mb-2">
          {node.title}
        </div>
      )}

      <div className={`${node.type === 'central' ? 'text-base' : 'text-sm'} text-neutral-700`}>
        {node.content}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {node.children.map((child, idx) => (
            <div key={idx} className="text-xs text-neutral-600 pl-3 border-l-2 border-neutral-200">
              {child}
            </div>
          ))}
        </div>
      )}

      {node.tags && node.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {node.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {isHovered && !isDragging && node.type !== 'central' && (
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-6 h-6 bg-white rounded-full shadow-md border border-neutral-200 flex items-center justify-center hover:bg-neutral-50">
            <Edit2 className="w-3 h-3 text-neutral-600" />
          </button>
          <button className="w-6 h-6 bg-white rounded-full shadow-md border border-neutral-200 flex items-center justify-center hover:bg-neutral-50">
            <Link2 className="w-3 h-3 text-neutral-600" />
          </button>
          <button className="w-6 h-6 bg-white rounded-full shadow-md border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 hover:bg-red-50">
            <Trash2 className="w-3 h-3 text-neutral-600 hover:text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
}
