import * as React from "react";

import {
  SplitWorkspace,
  type SplitWorkspaceGridOrientation,
  type SplitWorkspaceLayout,
  type SplitWorkspaceLoadOptionSpec,
  type SplitWorkspaceOptionGroup,
  type SplitWorkspacePane,
  type SplitWorkspaceTilePreset,
} from "./SplitWorkspace";

export type WindowWorkspaceProps = {
  className?: string;
  panes: SplitWorkspacePane[];
  layout?: SplitWorkspaceLayout;
  gridOrientation?: SplitWorkspaceGridOrientation;
  tilePreset?: SplitWorkspaceTilePreset;
  defaultTilePreset?: SplitWorkspaceTilePreset;
  onTilePresetChange?: (preset: SplitWorkspaceTilePreset) => void;
  autoTileOnPaneAdd?: boolean;
  autoTileOnResize?: boolean;
  workspaceOptions?: SplitWorkspaceOptionGroup[];
  selectedWorkspaceId?: string;
  onWorkspaceChange?: (workspaceId: string) => void;
  title?: string;
  subtitle?: string;
  loadOptionRegistry?: Record<string, SplitWorkspaceLoadOptionSpec>;
  workspaceContext?: Record<string, unknown>;
  onAddPaneRequest?: () => void;
  onPaneClose?: (paneId: string) => void;
  onPaneActionSelect?: (paneId: string, actionId: string) => void;
  onSaveLayout?: () => void;
};

export function WindowWorkspace({
  className,
  panes,
  layout = "canvas",
  gridOrientation = "row",
  tilePreset,
  defaultTilePreset,
  onTilePresetChange,
  autoTileOnPaneAdd = true,
  autoTileOnResize = true,
  workspaceOptions,
  selectedWorkspaceId,
  onWorkspaceChange,
  title = "Window Workspace",
  subtitle = "Dynamic support panes",
  loadOptionRegistry,
  workspaceContext,
  onAddPaneRequest,
  onPaneClose,
  onPaneActionSelect,
  onSaveLayout,
}: WindowWorkspaceProps) {
  return (
    <SplitWorkspace
      className={className}
      layout={layout}
      gridOrientation={gridOrientation}
      tilePreset={tilePreset}
      defaultTilePreset={defaultTilePreset}
      onTilePresetChange={onTilePresetChange}
      autoTileOnPaneAdd={autoTileOnPaneAdd}
      autoTileOnResize={autoTileOnResize}
      showTopBar
      showTopBarActions
      showTopBarMenuButton={false}
      showActionBarBelowHeader
      showTopBarAddButton={false}
      showAddPaneButton={false}
      title={title}
      subtitle={subtitle}
      workspaceOptions={workspaceOptions}
      selectedWorkspaceId={selectedWorkspaceId}
      onWorkspaceChange={onWorkspaceChange}
      panes={panes}
      workspaceContext={workspaceContext}
      loadOptionRegistry={loadOptionRegistry}
      onPaneActionSelect={onPaneActionSelect}
      onAddPaneRequest={onAddPaneRequest}
      onPaneClose={onPaneClose}
      onSaveLayout={onSaveLayout}
    />
  );
}
