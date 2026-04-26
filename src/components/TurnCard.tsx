import { Message, Persona } from "../types";
import { User, Sparkles } from "lucide-react";

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

interface TurnCardProps {
  message: Message;
  persona?: Persona | null;
  resolvePersona?: (personaId: string) => Persona | null | undefined;
  userLabel?: string;
}

export function TurnCard({
  message,
  persona,
  resolvePersona,
  userLabel = "You",
}: TurnCardProps) {
  const resolvedPersona =
    persona ?? (message.personaId && resolvePersona ? resolvePersona(message.personaId) : null);
  const isUser = message.role === "user";

  return (
    <div className="flex gap-3 py-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        ) : resolvedPersona ? (
          <div
            className="h-10 w-10 rounded-full p-1 flex items-center justify-center"
            style={{ backgroundColor: getSoftAvatarColor(resolvedPersona.avatarColor) }}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: resolvedPersona.avatarColor }}
            >
              {resolvedPersona.name.charAt(0)}
            </div>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">
            {isUser ? userLabel : resolvedPersona?.name}
          </span>
          {!isUser && resolvedPersona && (
            <span className="text-xs text-muted-foreground">{resolvedPersona.role}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.status === "thinking" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              Thinking...
            </span>
          )}
        </div>

        {/* Message Content */}
        <div className="text-sm text-foreground leading-relaxed">
          {message.content}
        </div>

        {/* Footer - Confidence & Citations */}
        {(message.confidence || message.citations) && (
          <div className="flex items-center gap-3 mt-2">
            {message.confidence && (
              <span className="text-xs text-muted-foreground">
                Confidence: {Math.round(message.confidence * 100)}%
              </span>
            )}
            {message.citations && message.citations.length > 0 && (
              <div className="flex gap-1">
                {message.citations.map((citation) => (
                  <button
                    key={citation.id}
                    className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    {citation.source}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
