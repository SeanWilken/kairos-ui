import * as React from "react";
import {
  LayoutGrid,
  Maximize2,
  Menu,
  Minimize2,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Save,
  Shuffle,
  X,
} from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizeable";
import { LeftSidebarMenu, type LeftSidebarMenuItem } from "./LeftSidebarMenu";
import { DynamicWorkspacePane } from "./DynamicWorkspacePane";
import { cn } from "./ui/utils";

export type SplitWorkspaceLayout = "split" | "canvas";
export type SplitWorkspaceGridOrientation = "row" | "column";
export type SplitWorkspaceTilePreset =
  | "grid-landscape"
  | "grid-portrait"
  | "columns"
  | "rows"
  | "main-left"
  | "main-right"
  | "main-top"
  | "main-bottom";

export type SplitWorkspacePaneAction = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type SplitWorkspaceLoadOption = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type SplitWorkspaceLoadOptionSpec = SplitWorkspaceLoadOption & {
  isAvailable?: (context: Record<string, unknown>, pane: SplitWorkspacePane) => boolean;
  render?: (context: Record<string, unknown>, pane: SplitWorkspacePane) => React.ReactNode;
};

export type SplitWorkspacePane = {
  id: string;
  title?: string;
  description?: string;
  loadedLabel?: string;
  menuActions?: SplitWorkspacePaneAction[];
  loadOptions?: SplitWorkspaceLoadOption[];
  loadOptionKeys?: string[];
  loadLabel?: string;
  groupId?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  /** Defaults to true when the workspace has an onPaneClose handler. */
  canClose?: boolean;
  disabled?: boolean;
  outlet?: React.ReactNode | ((pane: SplitWorkspacePane) => React.ReactNode);
  canvasRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type SplitWorkspaceGroupOption = {
  id: string;
  label: string;
};

export type SplitWorkspaceOptionGroup = {
  label: string;
  options: SplitWorkspaceGroupOption[];
};

export type SplitWorkspaceProps = {
  className?: string;
  layout?: SplitWorkspaceLayout;
  panes: SplitWorkspacePane[];
  direction?: "horizontal" | "vertical";
  gridOrientation?: SplitWorkspaceGridOrientation;
  tilePreset?: SplitWorkspaceTilePreset;
  defaultTilePreset?: SplitWorkspaceTilePreset;
  onTilePresetChange?: (preset: SplitWorkspaceTilePreset) => void;
  showHandles?: boolean;
  handleWithGrip?: boolean;
  showPaneHeader?: boolean;
  emptyState?: React.ReactNode;
  onPaneClose?: (paneId: string) => void;
  onPaneActionSelect?: (paneId: string, actionId: string) => void;
  onPaneLoadOptionSelect?: (paneId: string, optionId: string) => void;
  onPaneLoadRequest?: (paneId: string) => void;
  renderPane?: (pane: SplitWorkspacePane, index: number) => React.ReactNode;
  actionMenuItems?: LeftSidebarMenuItem[];
  onActionMenuSelect?: (id: string) => void;
  workspaceOptions?: SplitWorkspaceOptionGroup[];
  selectedWorkspaceId?: string;
  onWorkspaceChange?: (workspaceId: string) => void;
  saveLabel?: string;
  onSaveLayout?: () => void;
  onAddPaneRequest?: () => void;
  addPaneLabel?: string;
  showAddPaneButton?: boolean;
  showAddPaneLabel?: boolean;
  defaultLoadOptions?: SplitWorkspaceLoadOption[];
  loadOptionRegistry?: Record<string, SplitWorkspaceLoadOptionSpec>;
  workspaceContext?: Record<string, unknown>;
  title?: string;
  subtitle?: string;
  showTopBar?: boolean;
  showTopBarActions?: boolean;
  showTopBarMenuButton?: boolean;
  showActionBarBelowHeader?: boolean;
  showTopBarAddButton?: boolean;
  /** Reapply the selected canvas tile preset when the controlled panes array gains panes. */
  autoTileOnPaneAdd?: boolean;
  /** Reapply the selected canvas tile preset when the canvas changes size. */
  autoTileOnResize?: boolean;
};

type PaneRect = { x: number; y: number; width: number; height: number };

export function SplitWorkspace({
  className,
  layout = "canvas",
  panes,
  direction = "horizontal",
  gridOrientation = "row",
  tilePreset,
  defaultTilePreset,
  onTilePresetChange,
  showHandles = true,
  handleWithGrip = false,
  showPaneHeader = true,
  emptyState,
  onPaneClose,
  onPaneActionSelect,
  onPaneLoadOptionSelect,
  onPaneLoadRequest,
  renderPane,
  actionMenuItems,
  onActionMenuSelect,
  workspaceOptions,
  selectedWorkspaceId,
  onWorkspaceChange,
  saveLabel = "Save",
  onSaveLayout,
  onAddPaneRequest,
  addPaneLabel = "Add window",
  showAddPaneButton = true,
  showAddPaneLabel = false,
  defaultLoadOptions,
  loadOptionRegistry,
  workspaceContext,
  title = "SplitWorkspace",
  subtitle,
  showTopBar = true,
  showTopBarActions = true,
  showTopBarMenuButton = true,
  showActionBarBelowHeader = false,
  showTopBarAddButton = false,
  autoTileOnPaneAdd = false,
  autoTileOnResize = false,
}: SplitWorkspaceProps) {
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false);
  const [paneMenuOpenId, setPaneMenuOpenId] = React.useState<string | null>(null);
  const [expandedPaneId, setExpandedPaneId] = React.useState<string | null>(null);
  const [paneSelections, setPaneSelections] = React.useState<Record<string, string>>({});
  const [paneReloadKeys, setPaneReloadKeys] = React.useState<Record<string, number>>({});
  const [isReassignMode, setIsReassignMode] = React.useState(false);
  const [draggedSelectionId, setDraggedSelectionId] = React.useState<string | null>(null);
  const [internalTilePreset, setInternalTilePreset] = React.useState<SplitWorkspaceTilePreset>(
    defaultTilePreset ?? (gridOrientation === "row" ? "grid-landscape" : "grid-portrait"),
  );
  const [canvasRects, setCanvasRects] = React.useState<Record<string, PaneRect>>(() =>
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

  const canvasRef = React.useRef<HTMLDivElement>(null);
  const dragState = React.useRef<{
    paneId: string;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    startRect: PaneRect;
  } | null>(null);

  React.useEffect(() => {
    setCanvasRects((current) => {
      const next = { ...current };
      for (const pane of panes) {
        if (!next[pane.id]) {
          const count = Object.keys(next).length;
          next[pane.id] = pane.canvasRect ?? { x: 24, y: 24, width: 520, height: 300 };
          if (!pane.canvasRect) {
            next[pane.id] = {
              x: 24 + (count % 3) * 42,
              y: 24 + (count % 4) * 34,
              width: 520,
              height: 300,
            };
          }
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

  const resolvedTilePreset = tilePreset ?? internalTilePreset;

  React.useEffect(() => {
    if (tilePreset === undefined && defaultTilePreset === undefined) {
      setInternalTilePreset(gridOrientation === "row" ? "grid-landscape" : "grid-portrait");
    }
  }, [defaultTilePreset, gridOrientation, tilePreset]);

  const arrangeTiles = (preset: SplitWorkspaceTilePreset): boolean => {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width < 260 || bounds.height < 180 || panes.length === 0) return false;

    const gap = 16;
    const width = Math.max(1, bounds.width - gap * 2);
    const height = Math.max(1, bounds.height - gap * 2);
    const next: Record<string, PaneRect> = {};

    const placeGrid = (columnCount: number, rowCount: number) => {
      const paneWidth = Math.max(260, (width - gap * (columnCount - 1)) / columnCount);
      const paneHeight = Math.max(180, (height - gap * (rowCount - 1)) / rowCount);
      panes.forEach((pane, index) => {
        const column = index % columnCount;
        const row = Math.floor(index / columnCount);
        next[pane.id] = {
          x: gap + column * (paneWidth + gap),
          y: gap + row * (paneHeight + gap),
          width: paneWidth,
          height: paneHeight,
        };
      });
    };

    if (preset === "columns") {
      placeGrid(panes.length, 1);
    } else if (preset === "rows") {
      placeGrid(1, panes.length);
    } else if (preset === "grid-landscape" || preset === "grid-portrait") {
      const aspect = width / height;
      const preferredColumns = preset === "grid-landscape"
        ? Math.ceil(Math.sqrt(panes.length * aspect))
        : Math.max(1, Math.floor(Math.sqrt(panes.length * aspect)));
      const fitColumns = Math.max(1, Math.floor((width + gap) / (260 + gap)));
      const columnCount = Math.min(panes.length, preferredColumns, fitColumns);
      placeGrid(columnCount, Math.ceil(panes.length / columnCount));
    } else {
      const mainPane = panes[0];
      const secondaryPanes = panes.slice(1);
      const vertical = preset === "main-left" || preset === "main-right";
      const mainFirst = preset === "main-left" || preset === "main-top";
      const mainWidth = vertical ? (width - gap) * 0.62 : width;
      const mainHeight = vertical ? height : (height - gap) * 0.62;
      next[mainPane.id] = {
        x: gap + (vertical && !mainFirst ? width - mainWidth : 0),
        y: gap + (!vertical && !mainFirst ? height - mainHeight : 0),
        width: mainWidth,
        height: mainHeight,
      };

      if (secondaryPanes.length) {
        const secondaryWidth = vertical ? width - mainWidth - gap : width;
        const secondaryHeight = vertical ? height : height - mainHeight - gap;
        secondaryPanes.forEach((pane, index) => {
          const segment = vertical
            ? (secondaryHeight - gap * (secondaryPanes.length - 1)) / secondaryPanes.length
            : (secondaryWidth - gap * (secondaryPanes.length - 1)) / secondaryPanes.length;
          next[pane.id] = {
            x: gap + (vertical ? (mainFirst ? mainWidth + gap : 0) : index * (segment + gap)),
            y: gap + (vertical ? index * (segment + gap) : (mainFirst ? mainHeight + gap : 0)),
            width: vertical ? secondaryWidth : segment,
            height: vertical ? segment : secondaryHeight,
          };
        });
      }
    }

    setExpandedPaneId(null);
    setCanvasRects(next);
    return true;
  };

  const selectTilePreset = (preset: SplitWorkspaceTilePreset) => {
    if (tilePreset === undefined) setInternalTilePreset(preset);
    onTilePresetChange?.(preset);
    arrangeTiles(preset);
  };

  const previousPaneIdsRef = React.useRef(new Set(panes.map((pane) => pane.id)));
  React.useEffect(() => {
    const previousIds = previousPaneIdsRef.current;
    const paneAdded = panes.some((pane) => !previousIds.has(pane.id));
    previousPaneIdsRef.current = new Set(panes.map((pane) => pane.id));

    if (!autoTileOnPaneAdd || layout !== "canvas" || !paneAdded) return;
    let frame = 0;
    let attempts = 0;
    const arrangeWhenReady = () => {
      attempts += 1;
      if (!arrangeTiles(resolvedTilePreset) && attempts < 10) {
        frame = window.requestAnimationFrame(arrangeWhenReady);
      }
    };
    frame = window.requestAnimationFrame(arrangeWhenReady);
    return () => window.cancelAnimationFrame(frame);
  }, [autoTileOnPaneAdd, layout, panes, resolvedTilePreset]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!autoTileOnResize || layout !== "canvas" || !canvas || typeof ResizeObserver === "undefined") return;

    let frame = 0;
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => arrangeTiles(resolvedTilePreset));
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [autoTileOnResize, layout, panes, resolvedTilePreset]);

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

    const optionsFromRegistry = pane.loadOptionKeys?.length
      ? pane.loadOptionKeys
          .map((key) => loadOptionRegistry?.[key])
          .filter((option): option is SplitWorkspaceLoadOptionSpec => Boolean(option))
      : [];

    const optionCandidates = optionsFromRegistry.length ? optionsFromRegistry : (pane.loadOptions ?? defaultLoadOptions ?? []);
    const context = workspaceContext ?? {};
    const options = optionCandidates.filter((option) => {
      if (typeof (option as SplitWorkspaceLoadOptionSpec).isAvailable === "function") {
        return (option as SplitWorkspaceLoadOptionSpec).isAvailable?.(context, pane) !== false;
      }
      return true;
    });

    const selectedOptionId = paneSelections[pane.id];

    return (
      <DynamicWorkspacePane
        options={options}
        value={paneSelections[pane.id]}
        showReset={false}
        customLoadLabel={pane.loadLabel ?? "Load custom content"}
        onRequestCustomLoad={() => onPaneLoadRequest?.(pane.id)}
        onValueChange={(optionId) => {
          setPaneSelections((current) => ({ ...current, [pane.id]: optionId }));
          onPaneLoadOptionSelect?.(pane.id, optionId);
        }}
        onReset={() => {
          setPaneSelections((current) => ({ ...current, [pane.id]: "" }));
        }}
        renderLoaded={(option) => {
          const mapped = loadOptionRegistry?.[option.id];
          if (mapped?.render) {
            return <React.Fragment key={`${pane.id}-${selectedOptionId ?? option.id}-${paneReloadKeys[pane.id] ?? 0}`}>{mapped.render(context, pane)}</React.Fragment>;
          }

          return (
            <div className="h-full min-h-0 flex items-center justify-center p-6 text-sm text-muted-foreground">
              {option.title}
            </div>
          );
        }}
      />
    );
  };

  const getPaneDisplayLabel = (pane: SplitWorkspacePane, index: number) => {
    const selectedId = paneSelections[pane.id];
    if (selectedId) {
      const mapped = loadOptionRegistry?.[selectedId];
      if (mapped?.title) return mapped.title;
      const option = pane.loadOptions?.find((entry) => entry.id === selectedId) ?? defaultLoadOptions?.find((entry) => entry.id === selectedId);
      if (option?.title) return option.title;
    }
    return pane.loadedLabel ?? pane.title ?? `Pane ${index + 1}`;
  };

  const paneTabEntries = React.useMemo(() => {
    return panes
      .map((pane, index) => {
        const optionId = paneSelections[pane.id];
        return {
          paneId: pane.id,
          optionId,
          label: getPaneDisplayLabel(pane, index),
        };
      });
  }, [panes, paneSelections]);

  const renderPaneHeader = (
    pane: SplitWorkspacePane,
    index: number,
    draggable = false,
    onMouseDown?: (event: React.MouseEvent) => void,
  ) => (
    <div
      className={cn("h-10 border-b border-border px-3 flex items-center justify-between gap-2", draggable ? "cursor-move" : "")}
      onMouseDown={onMouseDown}
      onDragOver={isReassignMode ? (event) => event.preventDefault() : undefined}
      onDrop={
        isReassignMode
          ? (event) => {
              event.preventDefault();
              const optionId = event.dataTransfer.getData("text/plain") || draggedSelectionId;
              if (!optionId) return;
              setPaneSelections((current) => ({ ...current, [pane.id]: optionId }));
              setDraggedSelectionId(null);
            }
          : undefined
      }
    >
      <div className="min-w-0">
        <h4 className="truncate text-sm">{getPaneDisplayLabel(pane, index)}</h4>
      </div>
      <div className="flex items-center gap-1">
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
            <div
              className="absolute right-0 top-8 z-20 min-w-[180px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
              onMouseDown={(event) => event.stopPropagation()}
            >
              {pane.menuActions?.map((action) => (
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
              {pane.menuActions?.length ? <div className="my-1 h-px bg-border" /> : null}
              {paneSelections[pane.id] ? (
                <>
                  <button
                    type="button"
                    className="w-full px-2 py-1.5 rounded text-left text-sm hover:bg-accent inline-flex items-center gap-2"
                    onClick={() => {
                      setPaneSelections((current) => ({ ...current, [pane.id]: "" }));
                      setPaneMenuOpenId(null);
                    }}
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Change content
                  </button>
                  <button
                    type="button"
                    className="w-full px-2 py-1.5 rounded text-left text-sm hover:bg-accent inline-flex items-center gap-2"
                    onClick={() => {
                      setPaneReloadKeys((current) => ({ ...current, [pane.id]: (current[pane.id] ?? 0) + 1 }));
                      setPaneMenuOpenId(null);
                    }}
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Refresh content
                  </button>
                </>
              ) : null}
              <button
                type="button"
                className="w-full px-2 py-1.5 rounded text-left text-sm hover:bg-accent inline-flex items-center gap-2"
                onClick={() => {
                  setExpandedPaneId((current) => (current === pane.id ? null : pane.id));
                  setPaneMenuOpenId(null);
                }}
              >
                {expandedPaneId === pane.id ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {expandedPaneId === pane.id ? "Restore pane" : "Expand pane"}
              </button>
              {pane.canClose !== false && onPaneClose ? (
                <>
                  <div className="my-1 h-px bg-border" />
                  <button
                    type="button"
                    className="w-full px-2 py-1.5 rounded text-left text-sm text-destructive hover:bg-destructive/10 inline-flex items-center gap-2"
                    onClick={() => {
                      onPaneClose(pane.id);
                      setPaneMenuOpenId(null);
                    }}
                  >
                    <X className="w-3.5 h-3.5" /> Close pane
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (panes.length === 0) {
    return (
      <div className={cn("h-full min-h-[32rem] w-full bg-background relative flex flex-col", className)}>
        {showTopBar ? (
          <div className="h-14 border-b border-border px-3 flex items-center justify-between gap-3 bg-background">
            <div className="min-w-0">
              <h3 className="truncate">{title}</h3>
              {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
            </div>
          </div>
        ) : null}
        {showTopBar && showActionBarBelowHeader ? (
          <div className="h-11 border-b border-border px-3 flex items-end gap-1 bg-background">
            <button
              type="button"
              onClick={onAddPaneRequest}
              disabled={!onAddPaneRequest}
              className="mb-1 h-8 w-8 rounded-md border border-border text-muted-foreground inline-flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              title={addPaneLabel}
              aria-label={addPaneLabel}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : null}
        <div className="flex-1 border border-dashed border-border rounded-lg flex items-center justify-center m-3">
          {emptyState ?? <p className="text-sm text-muted-foreground">No panes open. Use the + in the tab bar to add one.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full min-h-[32rem] w-full bg-background relative flex flex-col", className)}>
      <LeftSidebarMenu
        isOpen={isActionMenuOpen}
        onClose={() => setIsActionMenuOpen(false)}
        onSelectMode={(id) => {
          onActionMenuSelect?.(id);
          setIsActionMenuOpen(false);
        }}
        placement="workspace"
        items={actionMenuItems}
      />

      {showTopBar ? (
      <div className="h-14 border-b border-border px-3 flex items-center justify-between gap-3 bg-background overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          {showTopBarMenuButton ? (
            <button
              type="button"
              onClick={() => setIsActionMenuOpen(true)}
              className="h-10 w-10 rounded-md border border-border inline-flex items-center justify-center hover:bg-accent"
              title="Open actions"
              aria-label="Open actions"
            >
              <Menu className="w-5 h-5" />
            </button>
          ) : null}

          {workspaceOptions?.length ? (
            <div className="min-w-[240px] max-w-[420px]">
              <select
                value={selectedWorkspaceId}
                onChange={(event) => onWorkspaceChange?.(event.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {workspaceOptions.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          ) : (
            <div className="min-w-0">
              <h3 className="truncate">{title}</h3>
              {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
            </div>
          )}
        </div>

        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          {showTopBarAddButton ? (
            <button
              type="button"
              onClick={onAddPaneRequest}
              disabled={!onAddPaneRequest}
              className="h-10 w-10 rounded-md border border-border inline-flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              title={addPaneLabel}
              aria-label={addPaneLabel}
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : null}

          {showTopBarActions && layout === "canvas" ? (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => arrangeTiles(resolvedTilePreset)}
                className="h-10 px-3 rounded-l-md border border-border text-sm inline-flex items-center gap-2 hover:bg-accent"
                title="Apply selected tile layout"
              >
                <LayoutGrid className="w-4 h-4" />
                Tile
              </button>
              <select
                value={resolvedTilePreset}
                onChange={(event) => selectTilePreset(event.target.value as SplitWorkspaceTilePreset)}
                className="h-10 max-w-[11rem] rounded-r-md border border-l-0 border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Tile layout"
                title="Tile layout"
              >
                <option value="grid-landscape">Grid landscape</option>
                <option value="grid-portrait">Grid portrait</option>
                <option value="columns">Side by side</option>
                <option value="rows">Stacked</option>
                <option value="main-left">Main left</option>
                <option value="main-right">Main right</option>
                <option value="main-top">Main top</option>
                <option value="main-bottom">Main bottom</option>
              </select>
            </div>
          ) : null}

          {showTopBarActions ? (
            <button
              type="button"
              onClick={onSaveLayout}
              className="h-10 px-3 rounded-md border border-border text-sm inline-flex items-center gap-2 hover:bg-accent"
              title={saveLabel}
            >
              <Save className="w-4 h-4" />
              {saveLabel}
            </button>
          ) : null}

          {showTopBarActions ? (
            <button
              type="button"
              onClick={() => setIsReassignMode((current) => !current)}
              className={cn("h-10 px-3 rounded-md border text-sm hover:bg-accent", isReassignMode ? "border-primary bg-accent" : "border-border")}
              title="Rearrange loaded content"
            >
              Rearrange
            </button>
          ) : null}
        </div>
      </div>
      ) : null}

      {showTopBar && showActionBarBelowHeader ? (
        <div className="h-11 border-b border-border px-3 flex items-end gap-1 bg-background overflow-x-auto">
          <div className="flex min-w-max items-end gap-1">
            {paneTabEntries.map((entry) => (
              <button
                key={`bar-${entry.paneId}-${entry.optionId}`}
                type="button"
                onClick={() => setExpandedPaneId(entry.paneId)}
                draggable={isReassignMode && Boolean(entry.optionId)}
                onDragStart={(event) => {
                  if (!entry.optionId) return;
                  setDraggedSelectionId(entry.optionId);
                  event.dataTransfer.setData("text/plain", entry.optionId);
                }}
                className={cn(
                  "h-8 max-w-[12rem] px-3 rounded-t-md border border-b-0 text-xs whitespace-nowrap truncate hover:bg-accent",
                  expandedPaneId === entry.paneId ? "border-primary bg-accent text-foreground" : "border-border bg-muted/30",
                )}
                title={entry.label}
              >
                {entry.label}
              </button>
            ))}
            {layout === "canvas" ? (
              <button
                type="button"
                onClick={onAddPaneRequest}
                disabled={!onAddPaneRequest}
                className="h-8 w-8 rounded-md border border-border text-muted-foreground inline-flex shrink-0 items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                title={addPaneLabel}
                aria-label={addPaneLabel}
              >
                <Plus className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex-1 min-h-[20rem] relative">
      {layout === "split" ? (
        <div className="h-full min-h-0">
          {expandedPaneId ? (
            <div className="h-full min-h-0 rounded-lg border border-border overflow-hidden">
              {panes
                .filter((pane) => pane.id === expandedPaneId)
                .map((pane, index) => (
                  <div
                    key={pane.id}
                    className={cn("h-full min-h-0 flex flex-col bg-background", pane.disabled ? "opacity-65" : "")}
                  >
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
                    <div
                      className={cn("h-full min-h-0 flex flex-col bg-background", pane.disabled ? "opacity-65" : "")}
                    >
                      {showPaneHeader ? renderPaneHeader(pane, index) : null}
                      <div className="flex-1 min-h-0 overflow-auto">{resolvePaneContent(pane, index)}</div>
                    </div>
                  </ResizablePanel>

                  {showHandles && index < panes.length - 1 ? <ResizableHandle withHandle={handleWithGrip} /> : null}
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          )}
        </div>
      ) : (
        <div ref={canvasRef} className="relative h-full min-h-0 overflow-auto bg-muted/20">
          {(expandedPaneId ? panes.filter((pane) => pane.id === expandedPaneId) : panes).map((pane, index) => {
            const rect = canvasRects[pane.id] ?? { x: 24, y: 24, width: 520, height: 300 };
            const content = resolvePaneContent(pane, index);
            const expanded = expandedPaneId === pane.id;

            return (
              <div
                key={pane.id}
                className={cn("absolute border-2 border-border bg-background shadow-sm flex flex-col min-h-0", pane.disabled ? "opacity-65" : "")}
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

      {layout === "canvas" && showAddPaneButton && !showTopBarAddButton ? (
        <div className="absolute bottom-4 right-4 z-[80] flex items-center gap-2 pointer-events-none">
          {showAddPaneLabel ? (
            <span className="pointer-events-none px-2 py-1 rounded bg-background border border-border text-xs text-foreground shadow-sm">
              {addPaneLabel}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onAddPaneRequest}
            disabled={!onAddPaneRequest}
            className="pointer-events-auto h-12 w-12 rounded-full border-2 border-primary bg-primary text-primary-foreground inline-flex items-center justify-center shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            title={addPaneLabel}
            aria-label={addPaneLabel}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      ) : null}
      </div>
    </div>
  );
}
