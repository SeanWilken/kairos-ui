import * as React from "react";
import {
  Bot,
  ChevronDown,
  Menu,
  PanelRightClose,
  PanelRightDashed,
  Send,
  User,
} from "lucide-react";

import {
  LeftSidebarMenu,
  type LeftSidebarMenuItem,
} from "./LeftSidebarMenu";
import { cn } from "./ui/utils";

export type ChatParticipant = {
  id: string;
  name: string;
  role?: string;
  avatarColor?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "participant";
  participantId?: string;
  content: string;
  timestamp: Date;
  meta?: React.ReactNode;
};

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

function getSoftAvatarColor(color: string, alpha = 0.16) {
  const normalized = color.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return "rgba(113, 113, 130, 0.16)";
  }

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
  const [internalDraft, setInternalDraft] = React.useState(defaultDraft);
  const [internalRightPanelOpen, setInternalRightPanelOpen] = React.useState(defaultRightPanelOpen);
  const [internalActionMenuOpen, setInternalActionMenuOpen] = React.useState(defaultActionMenuOpen);
  const [isModeMenuOpen, setIsModeMenuOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const draftValue = draft ?? internalDraft;
  const hasRightPanel = Boolean(rightPanel);
  const isRightPanelOpen = hasRightPanel ? (rightPanelOpen ?? internalRightPanelOpen) : false;
  const hasActionMenu = Boolean(actionMenuItems?.length || onActionMenuSelect);
  const showActionMenu = showActionMenuButton ?? hasActionMenu;
  const isActionMenuOpen = actionMenuOpen ?? internalActionMenuOpen;

  const participantsById = React.useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant])),
    [participants],
  );

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const setDraftValue = (value: string) => {
    if (draft === undefined) {
      setInternalDraft(value);
    }
    onDraftChange?.(value);
  };

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draftValue.trim();
    if (!value) return;
    onSendMessage?.(value);
    setDraftValue("");
  };

  const renderAvatar = (message: ChatMessage) => {
    if (message.role === "user") {
      return (
        <div className={cn("rounded-full bg-muted flex items-center justify-center", compact ? "h-7 w-7" : "h-8 w-8")}>
          <User className={cn("text-muted-foreground", compact ? "w-3.5 h-3.5" : "w-4 h-4")} />
        </div>
      );
    }

    if (message.role === "assistant") {
      return (
        <div className={cn("rounded-full bg-primary/12 text-primary flex items-center justify-center", compact ? "h-7 w-7" : "h-8 w-8")}>
          <Bot className={cn(compact ? "w-3.5 h-3.5" : "w-4 h-4")} />
        </div>
      );
    }

    const participant = message.participantId ? participantsById.get(message.participantId) : undefined;
    const avatarColor = participant?.avatarColor ?? "#717182";

    return (
      <div
        className={cn("rounded-full p-0.5 flex items-center justify-center", compact ? "h-8 w-8" : "h-10 w-10")}
        style={{ backgroundColor: getSoftAvatarColor(avatarColor) }}
      >
        <div
          className={cn("rounded-full text-white flex items-center justify-center", compact ? "h-7 w-7 text-[11px]" : "h-8 w-8 text-xs")}
          style={{ backgroundColor: avatarColor }}
          title={participant?.name ?? "Participant"}
        >
          {(participant?.name ?? "P").charAt(0)}
        </div>
      </div>
    );
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

        <div ref={scrollRef} className={cn("flex-1 min-h-0 overflow-auto", compact ? "px-3 py-2" : "px-4 sm:px-5 py-4")}>
          <div className={cn("mx-auto divide-y divide-border/50", compact ? "max-w-none" : "max-w-3xl")}>
            {messages.map((message) => {
              const participant = message.participantId
                ? participantsById.get(message.participantId)
                : undefined;
              const roleLabel =
                message.role === "user"
                  ? "You"
                  : message.role === "assistant"
                    ? "Assistant"
                    : participant?.name ?? "Participant";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "py-3 transition-colors",
                    onMessageSelect ? "cursor-pointer hover:bg-accent/30 rounded" : "",
                    selectedMessageId === message.id ? "bg-accent/30 rounded" : "",
                  )}
                  onClick={() => onMessageSelect?.(message)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">{renderAvatar(message)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{roleLabel}</span>
                        {participant?.role && message.role === "participant" ? (
                          <span className="text-xs text-muted-foreground">{participant.role}</span>
                        ) : null}
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className={cn("text-foreground", compact ? "text-sm" : "text-sm")}>{message.content}</div>
                      {message.meta ? <div className="mt-1">{message.meta}</div> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {footerSlot ? <div>{footerSlot}</div> : null}

        <div className={cn("border-t border-border", compact ? "px-3 py-2" : "px-4 sm:px-5 py-4")}>
          <form onSubmit={handleSubmit} className={cn("mx-auto flex gap-2", compact ? "max-w-none" : "max-w-3xl")}>
            {modeOptions && modeOptions.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModeMenuOpen((open) => !open)}
                  className="h-full px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center gap-2 text-sm capitalize"
                >
                  {mode ?? modeOptions[0]}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isModeMenuOpen ? (
                  <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-lg p-1 z-20 min-w-[150px]">
                    {modeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="w-full text-left px-3 py-2 rounded text-sm capitalize hover:bg-accent"
                        onClick={() => {
                          onModeChange?.(option);
                          setIsModeMenuOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="relative flex-1">
              <input
                type="text"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <button
                type="submit"
                disabled={!draftValue.trim() || !onSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                title={sendLabel}
                aria-label={sendLabel}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
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
