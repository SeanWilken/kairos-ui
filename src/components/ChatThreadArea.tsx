import * as React from "react";
import { Bot, ChevronDown, Plus, Send, User, WandSparkles } from "lucide-react";

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

export type ChatInputAction = {
  id: string;
  label: string;
  description?: string;
  prefix?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type ChatCommandTokenKind = "mentions" | "task" | "context" | "text";

export type ChatCommandTokenSpec = {
  key: string;
  label: string;
  kind: ChatCommandTokenKind;
  placeholder?: string;
  suggestions?: string[];
};

export type ChatCommandSpec = {
  key: string;
  label: string;
  description?: string;
  prefix?: string;
  icon?: React.ReactNode;
  tokens?: ChatCommandTokenSpec[];
};

export type ChatThreadAreaProps = {
  className?: string;
  compact?: boolean;
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
  commandSpecMap?: Record<string, ChatCommandSpec>;
  selectedCommandKey?: string;
  defaultCommandKey?: string;
  onCommandKeyChange?: (key: string) => void;
  onCommandTokenHintSelect?: (commandKey: string, tokenKey: string, suggestion: string) => void;
  inputActions?: ChatInputAction[];
  onInputActionSelect?: (action: ChatInputAction) => void;
  autoInsertActionPrefix?: boolean;
  preComposerSlot?: React.ReactNode;
  threadVariant?: "room" | "direct";
  onUploadClick?: () => void;
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

export function ChatThreadArea({
  className,
  compact = false,
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
  commandSpecMap,
  selectedCommandKey,
  defaultCommandKey,
  onCommandKeyChange,
  onCommandTokenHintSelect,
  inputActions,
  onInputActionSelect,
  autoInsertActionPrefix = true,
  preComposerSlot,
  threadVariant = "room",
  onUploadClick,
}: ChatThreadAreaProps) {
  const [internalDraft, setInternalDraft] = React.useState(defaultDraft);
  const [isModeMenuOpen, setIsModeMenuOpen] = React.useState(false);
  const [isInputActionMenuOpen, setIsInputActionMenuOpen] = React.useState(false);
  const [internalCommandKey, setInternalCommandKey] = React.useState(defaultCommandKey ?? "");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const draftValue = draft ?? internalDraft;
  const commandKey = selectedCommandKey ?? internalCommandKey;
  const commandSpecs = React.useMemo(() => Object.entries(commandSpecMap ?? {}), [commandSpecMap]);
  const activeCommandSpec = commandKey ? commandSpecMap?.[commandKey] : undefined;

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

  const setCommandKey = (next: string) => {
    if (selectedCommandKey === undefined) {
      setInternalCommandKey(next);
    }
    onCommandKeyChange?.(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draftValue.trim();
    if (!value) return;
    onSendMessage?.(value);
    setDraftValue("");
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    const nextHeight = Math.min(200, Math.max(54, textareaRef.current.scrollHeight));
    textareaRef.current.style.height = `${nextHeight}px`;
  }, [draftValue]);

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
    <div className={cn("h-full min-h-0 flex flex-col", className)}>
      <div ref={scrollRef} className={cn("flex-1 min-h-0 overflow-auto", compact ? "px-3 py-2" : "px-4 sm:px-5 py-4")}>
        <div className={cn("mx-auto divide-y divide-border/50", compact ? "max-w-none" : "max-w-3xl")}>
          {messages.map((message) => {
            const participant = message.participantId ? participantsById.get(message.participantId) : undefined;
            const roleLabel =
              message.role === "user"
                ? "You"
                : message.role === "assistant"
                  ? threadVariant === "direct"
                    ? (participants[0]?.name ?? "Assistant")
                    : "Assistant"
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

      {preComposerSlot ? <div>{preComposerSlot}</div> : null}

      <div className={cn("border-t border-border", compact ? "px-3 py-2" : "px-4 sm:px-5 py-3")}>
        <form onSubmit={handleSubmit} className={cn("mx-auto", compact ? "max-w-none" : "max-w-3xl")}>
          <div className="rounded-2xl border border-border bg-background/80 overflow-visible">
            <div className="relative px-3 pt-3 pb-2">
              <textarea
                ref={textareaRef}
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    const value = draftValue.trim();
                    if (!value) return;
                    onSendMessage?.(value);
                    setDraftValue("");
                  }
                }}
                placeholder={placeholder}
                className="w-full resize-none bg-transparent pr-14 text-sm leading-6 placeholder:text-muted-foreground focus:outline-none"
                rows={2}
              />
              <button
                type="submit"
                disabled={!draftValue.trim() || !onSendMessage}
                className="absolute right-3 bottom-2 h-10 w-10 rounded-lg bg-primary text-primary-foreground inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                title={sendLabel}
                aria-label={sendLabel}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="border-t border-border px-2 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
          {modeOptions && modeOptions.length > 0 ? (
            <div className="relative z-[120]">
              <button
                type="button"
                onClick={() => setIsModeMenuOpen((open) => !open)}
                className="h-9 px-3 rounded-md border border-border bg-background hover:bg-accent transition-colors flex items-center gap-2 text-sm capitalize"
              >
                {mode ?? modeOptions[0]}
                <ChevronDown className="w-4 h-4" />
              </button>

              {isModeMenuOpen ? (
                  <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-lg p-1 z-[140] min-w-[150px]">
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

          {inputActions?.length || commandSpecs.length ? (
            <div className="relative z-[120]">
              <button
                type="button"
                onClick={() => setIsInputActionMenuOpen((open) => !open)}
                className="h-9 px-3 rounded-md border border-border bg-background hover:bg-accent transition-colors inline-flex items-center gap-2 text-sm"
                title="Insert action template"
                aria-label="Insert action template"
              >
                <WandSparkles className="w-4 h-4" />
                Actions
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {isInputActionMenuOpen ? (
                <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-lg shadow-lg p-1 z-[140] min-w-[260px] max-w-[320px]">
                  {commandSpecs.map(([key, spec]) => (
                    <button
                      key={key}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded hover:bg-accent"
                      onClick={() => {
                        setCommandKey(key);
                        if (autoInsertActionPrefix && spec.prefix && !draftValue.trim()) {
                          setDraftValue(spec.prefix);
                        }
                        setIsInputActionMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        {spec.icon}
                        <span>{spec.label}</span>
                      </div>
                      {spec.description ? <div className="text-xs text-muted-foreground">{spec.description}</div> : null}
                    </button>
                  ))}

                  {commandSpecs.length && inputActions?.length ? <div className="my-1 border-t border-border" /> : null}

                  {inputActions?.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      disabled={action.disabled}
                      className="w-full text-left px-3 py-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        onInputActionSelect?.(action);
                        if (autoInsertActionPrefix && action.prefix && !draftValue.trim()) {
                          setDraftValue(action.prefix);
                        }
                        setIsInputActionMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        {action.icon}
                        <span>{action.label}</span>
                      </div>
                      {action.description ? <div className="text-xs text-muted-foreground">{action.description}</div> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
              </div>

              <button
                type="button"
                onClick={onUploadClick}
                className="h-9 w-9 rounded-full border-2 border-border text-muted-foreground inline-flex items-center justify-center hover:bg-accent"
                title="Upload file or photo"
                aria-label="Upload file or photo"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
        {activeCommandSpec?.tokens?.length ? (
          <div className="mx-auto mt-2 space-y-1 max-w-3xl">
            {activeCommandSpec.tokens.map((token) => (
              <div key={token.key} className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">@{token.label}</span>
                <span className="text-muted-foreground">{token.placeholder ?? "Provide value"}</span>
                {token.suggestions?.slice(0, 6).map((suggestion) => (
                  <button
                    key={`${token.key}-${suggestion}`}
                    type="button"
                    className="rounded border border-border px-1.5 py-0.5 hover:bg-accent"
                    onClick={() => onCommandTokenHintSelect?.(activeCommandSpec.key, token.key, suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
