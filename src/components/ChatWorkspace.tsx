import * as React from "react";
import { Menu, PanelRightClose, PanelRightDashed } from "lucide-react";

import { LeftSidebarMenu, type LeftSidebarMenuItem } from "./LeftSidebarMenu";
import {
  ChatThreadArea,
  type ChatInputAction,
  type ChatMessage,
  type ChatParticipant,
} from "./ChatThreadArea";
import { cn } from "./ui/utils";

export type { ChatInputAction, ChatMessage, ChatParticipant } from "./ChatThreadArea";

export type ChatWorkspaceProps = {
  className?: string;
  compact?: boolean;
  hideHeader?: boolean;
  title?: string;
  subtitle?: string;
  participants?: ChatParticipant[];
  messages: ChatMessage[];
  selectedMessageId?: string;
  onMessageSelect?: (message: ChatMessage) => void;
  placeholder?: string;
  sendLabel?: string;
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (value: string) => void;
  onSendMessage?: (value: string) => void;
  mode?: string;
  modeOptions?: string[];
  onModeChange?: (mode: string) => void;
  inputActions?: ChatInputAction[];
  onInputActionSelect?: (action: ChatInputAction) => void;
  autoInsertActionPrefix?: boolean;
  threadVariant?: "room" | "direct";
  rightPanel?: React.ReactNode;
  rightPanelWidth?: number;
  rightPanelOpen?: boolean;
  defaultRightPanelOpen?: boolean;
  onRightPanelOpenChange?: (open: boolean) => void;
  headerStartSlot?: React.ReactNode;
  headerEndSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  actionMenuItems?: LeftSidebarMenuItem[];
  showActionMenuButton?: boolean;
  actionMenuOpen?: boolean;
  defaultActionMenuOpen?: boolean;
  onActionMenuOpenChange?: (open: boolean) => void;
  onActionMenuSelect?: (id: string) => void;
};

export function ChatWorkspace({
  className,
  compact = false,
  hideHeader = false,
  title = "Conversation",
  subtitle,
  participants = [],
  messages,
  selectedMessageId,
  onMessageSelect,
  placeholder = "Send a message...",
  sendLabel = "Send",
  draft,
  defaultDraft = "",
  onDraftChange,
  onSendMessage,
  mode,
  modeOptions,
  onModeChange,
  inputActions,
  onInputActionSelect,
  autoInsertActionPrefix = true,
  threadVariant = "room",
  rightPanel,
  rightPanelWidth = 420,
  rightPanelOpen,
  defaultRightPanelOpen = true,
  onRightPanelOpenChange,
  headerStartSlot,
  headerEndSlot,
  footerSlot,
  actionMenuItems,
  showActionMenuButton,
  actionMenuOpen,
  defaultActionMenuOpen = false,
  onActionMenuOpenChange,
  onActionMenuSelect,
}: ChatWorkspaceProps) {
  const [internalRightPanelOpen, setInternalRightPanelOpen] = React.useState(defaultRightPanelOpen);
  const [internalActionMenuOpen, setInternalActionMenuOpen] = React.useState(defaultActionMenuOpen);

  const hasRightPanel = Boolean(rightPanel);
  const isRightPanelOpen = hasRightPanel ? (rightPanelOpen ?? internalRightPanelOpen) : false;
  const hasActionMenu = Boolean(actionMenuItems?.length || onActionMenuSelect);
  const showActionMenu = showActionMenuButton ?? hasActionMenu;
  const isActionMenuOpen = actionMenuOpen ?? internalActionMenuOpen;

  const setRightPanelOpen = (open: boolean) => {
    if (rightPanelOpen === undefined) {
      setInternalRightPanelOpen(open);
    }
    onRightPanelOpenChange?.(open);
  };

  const setActionMenuOpen = (open: boolean) => {
    if (actionMenuOpen === undefined) {
      setInternalActionMenuOpen(open);
    }
    onActionMenuOpenChange?.(open);
  };

  return (
    <div className={cn("h-full min-h-0 flex bg-background text-foreground", className)}>
      <div className="flex-1 min-w-0 min-h-0 flex flex-col relative">
        {!hideHeader ? (
          <div className={cn("border-b border-border px-4 sm:px-5 flex items-center", compact ? "h-14" : "h-[68px]")}>
            <div className="w-full flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-3">
                {showActionMenu ? (
                  <button
                    type="button"
                    onClick={() => setActionMenuOpen(true)}
                    className="h-9 w-9 rounded-md border border-border inline-flex items-center justify-center text-muted-foreground hover:bg-accent"
                    title="Open actions"
                    aria-label="Open actions"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                ) : null}
                {headerStartSlot}
                <div className="min-w-0">
                  <h3 className="truncate">{title}</h3>
                  {subtitle ? <p className="text-xs text-muted-foreground truncate">{subtitle}</p> : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {headerEndSlot}
                {hasRightPanel && isRightPanelOpen ? (
                  <button
                    type="button"
                    onClick={() => setRightPanelOpen(false)}
                    className="h-9 w-9 rounded-md border border-border inline-flex items-center justify-center text-muted-foreground hover:bg-accent"
                    title="Hide panel"
                    aria-label="Hide panel"
                  >
                    <PanelRightClose className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {showActionMenu ? (
          <LeftSidebarMenu
            isOpen={isActionMenuOpen}
            onClose={() => setActionMenuOpen(false)}
            onSelectMode={(id) => {
              onActionMenuSelect?.(id);
              setActionMenuOpen(false);
            }}
            placement="chat"
            items={actionMenuItems}
          />
        ) : null}

        {!hideHeader && hasRightPanel && !isRightPanelOpen ? (
          <div className="absolute right-0 top-0 z-40 h-14 flex items-center">
            <button
              type="button"
              onClick={() => setRightPanelOpen(true)}
              className="w-9 h-10 bg-background border border-r-0 border-border rounded-l-md inline-flex items-center justify-center hover:bg-accent"
              title="Open panel"
              aria-label="Open panel"
            >
              <PanelRightDashed className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : null}

        <ChatThreadArea
          compact={compact}
          participants={participants}
          messages={messages}
          selectedMessageId={selectedMessageId}
          onMessageSelect={onMessageSelect}
          placeholder={placeholder}
          sendLabel={sendLabel}
          draft={draft}
          defaultDraft={defaultDraft}
          onDraftChange={onDraftChange}
          onSendMessage={onSendMessage}
          mode={mode}
          modeOptions={modeOptions}
          onModeChange={onModeChange}
          inputActions={inputActions}
          onInputActionSelect={onInputActionSelect}
          autoInsertActionPrefix={autoInsertActionPrefix}
          preComposerSlot={footerSlot}
          threadVariant={threadVariant}
        />
      </div>

      {hasRightPanel && isRightPanelOpen ? (
        <div
          className="shrink-0 border-l border-border min-h-0 overflow-auto"
          style={{ width: `${rightPanelWidth}px`, minWidth: `${rightPanelWidth}px`, maxWidth: `${rightPanelWidth}px`, flexBasis: `${rightPanelWidth}px` }}
        >
          {rightPanel}
        </div>
      ) : null}
    </div>
  );
}
