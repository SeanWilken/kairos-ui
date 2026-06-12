import * as React from "react";
import { Bot, Maximize2, Minimize2, RefreshCw, Send, Settings, X } from "lucide-react";

import type { Persona } from "../types";
import { TurnCard, type TurnCardProps } from "./TurnCard";

export type ChatWidgetPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

export type ChatWidgetProps = {
  className?: string;
  isOpen?: boolean;
  assistantPersona: Persona;
  posts: TurnCardProps[];
  draft?: string;
  placeholder?: string;
  sendLabel?: string;
  widthClassName?: string;
  heightClassName?: string;
  position?: ChatWidgetPosition;
  showWindowHeader?: boolean;
  showSettingsButton?: boolean;
  isFullscreen?: boolean;
  topSlot?: React.ReactNode;
  onRefresh?: () => void;
  onSettingsClick?: () => void;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
  onDraftChange?: (value: string) => void;
  onSendMessage?: (value: string) => void;
};

const positionClasses: Record<ChatWidgetPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export function ChatWidget({
  className,
  isOpen = true,
  assistantPersona,
  posts,
  draft,
  placeholder = "Ask me anything...",
  sendLabel = "Send",
  widthClassName = "w-96",
  heightClassName = "h-[500px]",
  position = "bottom-left",
  showWindowHeader = true,
  showSettingsButton = false,
  isFullscreen = false,
  topSlot,
  onRefresh,
  onSettingsClick,
  onToggleFullscreen,
  onClose,
  onDraftChange,
  onSendMessage,
}: ChatWidgetProps) {
  if (!isOpen) return null;

  const [internalDraft, setInternalDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const draftValue = draft ?? internalDraft;

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [posts]);

  const setDraftValue = (value: string) => {
    if (draft === undefined) {
      setInternalDraft(value);
    }
    onDraftChange?.(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draftValue.trim();
    if (!value) return;
    onSendMessage?.(value);
    setDraftValue("");
  };

  const shellClassName = isFullscreen
    ? "fixed inset-0 z-50"
    : `fixed z-50 ${positionClasses[position]} ${widthClassName} ${heightClassName}`;

  return (
    <div className={[shellClassName, className].filter(Boolean).join(" ")}>
      <div className="h-full min-h-0 flex flex-col border border-border bg-background shadow-2xl">
      {showWindowHeader ? (
        <div className="px-3 py-2 border-b border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-full text-white flex items-center justify-center"
              style={{ backgroundColor: assistantPersona.avatarColor }}
            >
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm truncate">{assistantPersona.name}</div>
              <div className="text-xs text-muted-foreground truncate">{assistantPersona.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onRefresh}
              className="w-7 h-7 rounded hover:bg-accent inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
              title="Refresh"
              aria-label="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {showSettingsButton ? (
              <button
                type="button"
                onClick={onSettingsClick}
                className="w-7 h-7 rounded hover:bg-accent inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="w-7 h-7 rounded hover:bg-accent inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
              title={isFullscreen ? "Minimize" : "Maximize"}
              aria-label={isFullscreen ? "Minimize" : "Maximize"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded hover:bg-accent inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
              title="Close"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {topSlot ? <div className="border-b border-border bg-muted/50">{topSlot}</div> : null}

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto px-3">
        {posts.map((post) => (
          <TurnCard
            key={post.message.id}
            {...post}
            resolvePersona={(personaId) => {
              if (post.resolvePersona) {
                const resolved = post.resolvePersona(personaId);
                if (resolved) return resolved;
              }
              return personaId === assistantPersona.id ? assistantPersona : null;
            }}
          />
        ))}
      </div>

      <div className="border-t border-border px-3 py-2">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={draftValue}
            onChange={(event) => setDraftValue(event.target.value)}
            placeholder={placeholder}
            className="w-full h-10 rounded-md border border-border bg-background pl-3 pr-10 text-sm"
          />
          <button
            type="submit"
            disabled={!draftValue.trim() || !onSendMessage}
            className="absolute right-1.5 top-1.5 h-7 w-7 rounded bg-primary text-primary-foreground inline-flex items-center justify-center disabled:opacity-50"
            aria-label={sendLabel}
            title={sendLabel}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}

export const CompactAssistant = ChatWidget;
