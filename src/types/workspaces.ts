export type WorkspaceKind = "thread" | "split" | "window";

export type WorkspacePaneLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WorkspacePaneDTO = {
  id: string;
  title?: string;
  groupId?: string;
  loadOptionId?: string;
  isPinned?: boolean;
  canClose?: boolean;
  layout?: WorkspacePaneLayout;
  metadata?: Record<string, unknown>;
};

export type WorkspaceThreadBindingDTO = {
  threadId: string;
  mode?: string;
  responseMode?: string;
};

export type WorkspaceStateDTO = {
  layout: "canvas" | "split";
  gridOrientation?: "row" | "column";
  rightPanelOpen?: boolean;
  panes: WorkspacePaneDTO[];
};

export type WorkspaceRecordDTO = {
  id: string;
  orgId: string;
  name: string;
  kind: WorkspaceKind;
  description?: string;
  threadBinding?: WorkspaceThreadBindingDTO;
  state: WorkspaceStateDTO;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkspaceRequestDTO = {
  name: string;
  kind: WorkspaceKind;
  description?: string;
  threadBinding?: WorkspaceThreadBindingDTO;
  state: WorkspaceStateDTO;
};

export type UpdateWorkspaceRequestDTO = Partial<
  Pick<WorkspaceRecordDTO, "name" | "description" | "threadBinding" | "state">
>;
