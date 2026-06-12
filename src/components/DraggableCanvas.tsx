import * as React from "react";
import { Grid, Maximize2, ZoomIn, ZoomOut } from "lucide-react";

type Point = { x: number; y: number };

export interface DraggableCanvasProps {
  className?: string;
  contentClassName?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  showGrid?: boolean;
  showControls?: boolean;
  transformOrigin?: string;
  onBackgroundClick?: () => void;
  onArrange?: () => void;
  overlay?: React.ReactNode;
  renderControls?: (controls: {
    zoomIn: () => void;
    zoomOut: () => void;
    fitView: () => void;
    arrange: () => void;
    hasArrange: boolean;
  }) => React.ReactNode;
  children: (state: {
    zoom: number;
    pan: Point;
    zoomIn: () => void;
    zoomOut: () => void;
    fitView: () => void;
    arrange: () => void;
  }) => React.ReactNode;
}

export default function DraggableCanvas({
  className,
  contentClassName,
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 2,
  showGrid = true,
  showControls = true,
  transformOrigin = "0 0",
  onBackgroundClick,
  onArrange,
  overlay,
  renderControls,
  children,
}: DraggableCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(initialZoom);
  const [pan, setPan] = React.useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState<Point>({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isCanvasTarget =
      event.target === canvasRef.current ||
      target.classList.contains("canvas-bg") ||
      target.classList.contains("canvas-content");

    if (!isCanvasTarget) {
      return;
    }
    setIsPanning(true);
    setPanStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    onBackgroundClick?.();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPan({ x: event.clientX - panStart.x, y: event.clientY - panStart.y });
  };

  const stopPanning = () => setIsPanning(false);

  const handleZoomIn = () => setZoom((current) => Math.min(maxZoom, current + 0.2));
  const handleZoomOut = () => setZoom((current) => Math.max(minZoom, current - 0.2));
  const handleFitView = () => {
    setZoom(initialZoom);
    setPan({ x: 0, y: 0 });
  };
  const handleArrange = () => onArrange?.();

  return (
    <div
      ref={canvasRef}
      className={className ?? "relative h-full w-full min-h-[32rem] overflow-hidden bg-neutral-50"}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopPanning}
      onMouseLeave={stopPanning}
    >
      {showGrid ? (
        <div
          className="canvas-bg absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.3,
          }}
        />
      ) : null}

      <div
        className={contentClassName ?? "canvas-content absolute inset-0"}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin,
        }}
      >
        {children({
          zoom,
          pan,
          zoomIn: handleZoomIn,
          zoomOut: handleZoomOut,
          fitView: handleFitView,
          arrange: handleArrange,
        })}
      </div>

      {overlay}

      {showControls ? (
        renderControls ? (
          renderControls({
            zoomIn: handleZoomIn,
            zoomOut: handleZoomOut,
            fitView: handleFitView,
            arrange: handleArrange,
            hasArrange: Boolean(onArrange),
          })
        ) : (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="rounded p-2 transition-colors hover:bg-neutral-50"
            title="Zoom In"
            type="button"
          >
            <ZoomIn className="h-4 w-4 text-neutral-600" />
          </button>
          <button
            onClick={handleZoomOut}
            className="rounded p-2 transition-colors hover:bg-neutral-50"
            title="Zoom Out"
            type="button"
          >
            <ZoomOut className="h-4 w-4 text-neutral-600" />
          </button>
          <div className="my-1 h-px bg-neutral-200" />
          <button
            onClick={handleFitView}
            className="rounded p-2 transition-colors hover:bg-neutral-50"
            title="Fit View"
            type="button"
          >
            <Maximize2 className="h-4 w-4 text-neutral-600" />
          </button>
          {onArrange ? (
            <button
              onClick={onArrange}
              className="rounded p-2 transition-colors hover:bg-neutral-50"
              title="Auto-arrange"
              type="button"
            >
              <Grid className="h-4 w-4 text-neutral-600" />
            </button>
          ) : null}
        </div>
        )
      ) : null}
    </div>
  );
}
