import * as React from "react";
import { Archive, Bot, Pin, Search, User, Users } from "lucide-react";

import { cn } from "./ui/utils";

export type ChatThreadType = "room" | "direct" | "assistant";
export type ChatThreadFilter = "all" | "rooms" | "direct" | "archived";

export type ChatThreadParticipant = {
  id: string;
  name: string;
  avatarColor?: string;
};

export type ChatThreadItem = {
  id: string;
  name: string;
  type: ChatThreadType;
  participantIds?: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount?: number;
  isPinned?: boolean;
  isArchived?: boolean;
};

export type ChatThreadListProps = {
  className?: string;
  title?: string;
  description?: string;
  threads: ChatThreadItem[];
  participants?: ChatThreadParticipant[];
  selectedThreadId?: string;
  onSelectThread?: (thread: ChatThreadItem) => void;
  filter?: ChatThreadFilter;
  onFilterChange?: (filter: ChatThreadFilter) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  showSearch?: boolean;
  showFilters?: boolean;
};

export function ChatThreadList({
  className,
  title = "Messages",
  description = "Browse rooms and direct conversations",
  threads,
  participants = [],
  selectedThreadId,
  onSelectThread,
  filter,
  onFilterChange,
  searchQuery,
  onSearchQueryChange,
  showSearch = true,
  showFilters = true,
}: ChatThreadListProps) {
  const [internalFilter, setInternalFilter] = React.useState<ChatThreadFilter>("all");
  const [internalSearchQuery, setInternalSearchQuery] = React.useState("");

  const activeFilter = filter ?? internalFilter;
  const activeSearchQuery = searchQuery ?? internalSearchQuery;

  const participantsById = React.useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant])),
    [participants],
  );

  const setFilter = (nextFilter: ChatThreadFilter) => {
    if (filter === undefined) {
      setInternalFilter(nextFilter);
    }
    onFilterChange?.(nextFilter);
  };

  const setSearch = (nextSearch: string) => {
    if (searchQuery === undefined) {
      setInternalSearchQuery(nextSearch);
    }
    onSearchQueryChange?.(nextSearch);
  };

  const filteredThreads = threads
    .filter((thread) => {
      if (activeFilter === "rooms") return thread.type === "room";
      if (activeFilter === "direct") return thread.type === "direct" || thread.type === "assistant";
      if (activeFilter === "archived") return thread.isArchived;
      return !thread.isArchived;
    })
    .filter((thread) => thread.name.toLowerCase().includes(activeSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
    });

  return (
    <div className={cn("w-96 border-r border-border flex flex-col bg-background min-h-0", className)}>
      <div className="px-4 py-4 border-b border-border">
        <h2 className="mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {showSearch ? (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        ) : null}

        {showFilters ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 py-1.5 rounded text-xs transition-colors",
                activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("rooms")}
              className={cn(
                "px-3 py-1.5 rounded text-xs transition-colors",
                activeFilter === "rooms" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              Rooms
            </button>
            <button
              type="button"
              onClick={() => setFilter("direct")}
              className={cn(
                "px-3 py-1.5 rounded text-xs transition-colors",
                activeFilter === "direct" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              Direct
            </button>
            <button
              type="button"
              onClick={() => setFilter("archived")}
              className={cn(
                "px-3 py-1.5 rounded text-xs transition-colors",
                activeFilter === "archived" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent",
              )}
              aria-label="Archived"
              title="Archived"
            >
              <Archive className="w-3 h-3" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto">
        {filteredThreads.map((thread) => {
          const selected = selectedThreadId === thread.id;
          const avatarIcon = thread.type === "room" ? Users : thread.type === "assistant" ? Bot : User;
          const directParticipant = thread.type === "direct" && thread.participantIds?.length
            ? participantsById.get(thread.participantIds[0])
            : undefined;

          return (
            <button
              key={thread.id}
              type="button"
              onClick={() => onSelectThread?.(thread)}
              className={cn(
                "w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border/50 transition-colors",
                selected ? "bg-accent" : "hover:bg-accent",
              )}
            >
              <div className="flex-shrink-0">
                {directParticipant ? (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: directParticipant.avatarColor ?? "#717182" }}
                    title={directParticipant.name}
                  >
                    {directParticipant.name.charAt(0)}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {React.createElement(avatarIcon, { className: "w-5 h-5 text-muted-foreground" })}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {thread.isPinned ? <Pin className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : null}
                    <span className="text-sm truncate">{thread.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {thread.lastMessageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground line-clamp-1">{thread.lastMessage}</p>
                  {thread.unreadCount ? (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs flex-shrink-0">
                      {thread.unreadCount}
                    </span>
                  ) : null}
                </div>

                {thread.type === "room" && thread.participantIds?.length ? (
                  <div className="flex gap-1 mt-2">
                    {thread.participantIds.slice(0, 4).map((participantId) => {
                      const participant = participantsById.get(participantId);
                      if (!participant) return null;

                      return (
                        <div
                          key={`${thread.id}-${participant.id}`}
                          className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: participant.avatarColor ?? "#717182" }}
                          title={participant.name}
                        >
                          {participant.name.charAt(0)}
                        </div>
                      );
                    })}
                    {thread.participantIds.length > 4 ? (
                      <div className="h-5 w-5 rounded-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                        +{thread.participantIds.length - 4}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
