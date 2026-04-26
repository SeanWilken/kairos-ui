import * as React from "react";
import { Maximize2, Menu, Minimize2, MoreHorizontal, X } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizeable";
import {
  LeftSidebarMenu,
  type LeftSidebarMenuItem,
} from "./LeftSidebarMenu";
import { cn } from "./ui/utils";

export type SplitWorkspaceLayout = "split" | "canvas";

export type SplitWorkspacePaneAction = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type SplitWorkspacePane = {
  id: string;
  title?: string;
  description?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  canClose?: boolean;
  disabled?: boolean;
  loadedLabel?: string;
  menuActions?: SplitWorkspacePaneAction[];
  loadLabel?: string;
  outlet?: React.ReactNode | ((pane: SplitWorkspacePane) => React.ReactNode);
  canvasRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type SplitWorkspaceProps = {
  className?: string;
  layout?: SplitWorkspaceLayout;
  title?: string;
  subtitle?: string;
  panes: SplitWorkspacePane[];
  direction?: "horizontal" | "vertical";
  showHandles?: boolean;
  handleWithGrip?: boolean;
  showPaneHeader?: boolean;
  emptyState?: React.ReactNode;
  onPaneClose?: (paneId: string) => void;
  onPaneActionSelect?: (paneId: string, actionId: string) => void;
  onPaneLoadRequest?: (paneId: string) => void;
  renderPane?: (pane: SplitWorkspacePane, index: number) => React.ReactNode;
  actionMenuItems?: LeftSidebarMenuItem[];
  onActionMenuSelect?: (id: string) => void;
};

export function SplitWorkspace({
  className,
  layout = "canvas",
  title = "SplitWorkspace",
  subtitle,
  panes,
  direction = "horizontal",
  showHandles = true,
  handleWithGrip = false,
  showPaneHeader = true,
  emptyState,
  onPaneClose,
  onPaneActionSelect,
  onPaneLoadRequest,
  renderPane,
  actionMenuItems,
  onActionMenuSelect,
}: SplitWorkspaceProps) {
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false);
  const [paneMenuOpenId, setPaneMenuOpenId] = React.useState<string | null>(null);
  const [expandedPaneId, setExpandedPaneId] = React.useState<string | null>(null);
  const [canvasRects, setCanvasRects] = React.useState<Record<string, { x: number; y: number; width: number; height: number }>>(
    () =>
      Object.fromEntries(
        panes.map((pane, index) => [
          pane.id,
          pane.canvasRect ?? {
            x: 24 + (index % 2) * 360,
            y: 24 + Math.floor(index / 2) * 220,
            width: 520,
            height: 300,
          },
        ]),
      ),
  );
  const dragState = React.useRef<{
    paneId: string;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    startRect: { x: number; y: number; width: number; height: number };
  } | null>(null);

  React.useEffect(() => {
    setCanvasRects((current) => {
      const next = { ...current };
      for (const pane of panes) {
        if (!next[pane.id]) {
          next[pane.id] = pane.canvasRect ?? { x: 24, y: 24, width: 520, height: 300 };
        }
      }
      for (const paneId of Object.keys(next)) {
        if (!panes.some((pane) => pane.id === paneId)) {
          delete next[paneId];
        }
      }
      return next;
    });
  }, [panes]);

  React.useEffect(() => {
    if (expandedPaneId && !panes.some((pane) => pane.id === expandedPaneId)) {
      setExpandedPaneId(null);
    }
  }, [expandedPaneId, panes]);

  React.useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const active = dragState.current;
      if (!active) return;

      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;

      setCanvasRects((current) => {
        const paneRect = current[active.paneId];
        if (!paneRect) return current;

        if (active.mode === "move") {
          return {
            ...current,
            [active.paneId]: {
              ...paneRect,
              x: Math.max(0, active.startRect.x + dx),
              y: Math.max(0, active.startRect.y + dy),
            },
          };
        }

        return {
          ...current,
          [active.paneId]: {
            ...paneRect,
            width: Math.max(260, active.startRect.width + dx),
            height: Math.max(180, active.startRect.height + dy),
          },
        };
      });
    };

    const onUp = () => {
      dragState.current = null;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (panes.length === 0) {
    return (
      <div className={cn("h-full w-full border border-dashed border-border rounded-lg flex items-center justify-center", className)}>
        {emptyState ?? <p className="text-sm text-muted-foreground">No panes open</p>}
      </div>
    );
  }

  const resolvePaneContent = (pane: SplitWorkspacePane, index: number) => {
    if (renderPane) {
      return renderPane(pane, index);
    }

    if (typeof pane.outlet === "function") {
      return pane.outlet(pane);
    }

    if (pane.outlet) {
      return pane.outlet;
    }

    return (
      <div className="h-full min-h-0 flex items-center justify-center p-6">
        <button
          type="button"
          onClick={() => onPaneLoadRequest?.(pane.id)}
          className="h-10 px-4 rounded-md border border-border bg-background text-sm hover:bg-accent"
        >
          {pane.loadLabel ?? "Load content"}
        </button>
      </div>
    );
  };

  const renderPaneHeader = (pane: SplitWorkspacePane, index: number, draggable = false, onMouseDown?: (event: React.MouseEvent) => void) => (
    <div
      className={cn("h-10 border-b border-border px-3 flex items-center justify-between gap-2", draggable ? "cursor-move" : "")}
      onMouseDown={onMouseDown}
    >
      <div className="min-w-0">
        <h4 className="truncate text-sm">{pane.loadedLabel ?? pane.title ?? `Pane ${index + 1}`}</h4>
      </div>
      <div className="flex items-center gap-1">
        {pane.menuActions?.length ? (
          <div className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setPaneMenuOpenId((current) => (current === pane.id ? null : pane.id));
              }}
              className="h-7 w-7 rounded-md border border-border text-muted-foreground hover:bg-accent inline-flex items-center justify-center"
              title="Pane options"
              aria-label={`Options for ${pane.title ?? `pane ${index + 1}`}`}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {paneMenuOpenId === pane.id ? (
              <div className="absolute right-0 top-8 z-20 min-w-[140px] rounded-md border border-border bg-popover p-1 shadow-md">
                {pane.menuActions.map((action) => (
                  <button
                    key={`${pane.id}-${action.id}`}
                    type="button"
                    disabled={action.disabled}
                    className="w-full px-2 py-1.5 rounded text-left text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      onPaneActionSelect?.(pane.id, action.id);
                      setPaneMenuOpenId(null);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setExpandedPaneId((current) => (current === pane.id ? null : pane.id));
          }}
          className="h-7 w-7 rounded-md border border-border text-muted-foreground hover:bg-accent inline-flex items-center justify-center"
          title={expandedPaneId === pane.id ? "Exit expand" : "Expand pane"}
          aria-label={expandedPaneId === pane.id ? "Exit expand" : "Expand pane"}
        >
          {expandedPaneId === pane.id ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {pane.canClose ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPaneClose?.(pane.id);
            }}
            className="h-7 w-7 rounded-md border border-border text-muted-foreground hover:bg-accent inline-flex items-center justify-center"
            title="Close pane"
            aria-label={`Close ${pane.title ?? "pane"}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );

  const header = (
    <div className="h-14 border-b border-border px-3 flex items-center gap-3 bg-background">
      <button
        type="button"
        onClick={() => setIsActionMenuOpen(true)}
        className="h-10 w-10 rounded-md border border-border inline-flex items-center justify-center hover:bg-accent"
        title="Open actions"
        aria-label="Open actions"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="min-w-0">
        <h3 className="truncate">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground truncate">{subtitle}</p> : null}
      </div>
    </div>
  );

  return (
    <div className={cn("h-full min-h-0 w-full bg-background relative", className)}>
      <LeftSidebarMenu
        isOpen={isActionMenuOpen}
        onClose={() => setIsActionMenuOpen(false)}
        onSelectMode={(id) => {
          onActionMenuSelect?.(id);
          setIsActionMenuOpen(false);
        }}
        placement="chat"
        items={actionMenuItems}
      />

      {header}

      {layout === "split" ? (
        <div className="h-[calc(100%-3.5rem)] min-h-0">
      {expandedPaneId ? (
        <div className="h-full min-h-0 rounded-lg border border-border overflow-hidden">
          {panes
            .filter((pane) => pane.id === expandedPaneId)
            .map((pane, index) => (
              <div key={pane.id} className={cn("h-full min-h-0 flex flex-col bg-background", pane.disabled ? "opacity-65" : "") }>
                {showPaneHeader ? renderPaneHeader(pane, index) : null}
                <div className="flex-1 min-h-0 overflow-auto">{resolvePaneContent(pane, index)}</div>
              </div>
            ))}
        </div>
      ) : (
      <ResizablePanelGroup direction={direction} className="h-full min-h-0 rounded-lg border border-border overflow-hidden">
        {panes.map((pane, index) => (
          <React.Fragment key={pane.id}>
            <ResizablePanel
              defaultSize={pane.defaultSize}
              minSize={pane.minSize}
              maxSize={pane.maxSize}
              collapsible={pane.collapsible}
              collapsedSize={pane.collapsedSize}
              order={index + 1}
            >
              <div className={cn("h-full min-h-0 flex flex-col bg-background", pane.disabled ? "opacity-65" : "") }>
                {showPaneHeader ? renderPaneHeader(pane, index) : null}

                <div className="flex-1 min-h-0 overflow-auto">{resolvePaneContent(pane, index)}</div>
              </div>
            </ResizablePanel>

            {showHandles && index < panes.length - 1 ? (
              <ResizableHandle withHandle={handleWithGrip} />
            ) : null}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
      )}
        </div>
      ) : (
        <div className="relative h-[calc(100%-3.5rem)] min-h-0 overflow-auto bg-muted/20">
          {(expandedPaneId ? panes.filter((pane) => pane.id === expandedPaneId) : panes).map((pane, index) => {
            const rect = canvasRects[pane.id] ?? { x: 24, y: 24, width: 520, height: 300 };
            const content = resolvePaneContent(pane, index);
            const expanded = expandedPaneId === pane.id;

            return (
              <div
                key={pane.id}
                className={cn(
                  "absolute border-2 border-border bg-background shadow-sm flex flex-col min-h-0",
                  pane.disabled ? "opacity-65" : "",
                )}
                style={expanded ? { left: 12, top: 12, width: "calc(100% - 24px)", height: "calc(100% - 24px)" } : { left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
              >
                {showPaneHeader
                  ? renderPaneHeader(
                      pane,
                      index,
                      !expanded,
                      !expanded
                        ? (event) => {
                            dragState.current = {
                              paneId: pane.id,
                              mode: "move",
                              startX: event.clientX,
                              startY: event.clientY,
                              startRect: rect,
                            };
                            document.body.style.userSelect = "none";
                          }
                        : undefined,
                    )
                  : null}

                <div className="flex-1 min-h-0 overflow-auto">{content}</div>

                {!expanded ? (
                  <div
                    className="absolute right-1 bottom-1 w-5 h-5 cursor-se-resize"
                    onMouseDown={(event) => {
                      event.stopPropagation();
                      dragState.current = {
                        paneId: pane.id,
                        mode: "resize",
                        startX: event.clientX,
                        startY: event.clientY,
                        startRect: rect,
                      };
                      document.body.style.userSelect = "none";
                    }}
                  >
                    <div className="absolute right-0 bottom-0 w-4 h-4 border-r-2 border-b-2 border-foreground/55" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
