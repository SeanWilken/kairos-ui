import * as React from "react";

import {
  SplitWorkspace,
  type SplitWorkspaceGridOrientation,
  type SplitWorkspaceLayout,
  type SplitWorkspaceLoadOptionSpec,
  type SplitWorkspaceOptionGroup,
  type SplitWorkspacePane,
} from "./SplitWorkspace";

export type WindowWorkspaceProps = {
  className?: string;
  panes: SplitWorkspacePane[];
  layout?: SplitWorkspaceLayout;
  gridOrientation?: SplitWorkspaceGridOrientation;
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
      showTopBar
      showTopBarActions
      showTopBarMenuButton={false}
      showActionBarBelowHeader
      showTopBarAddButton
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
