import { Persona } from "../types";

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

interface ParticipantChipProps {
  persona: Persona;
  showRole?: boolean;
  size?: "sm" | "md";
}

export function ParticipantChip({ persona, showRole = true, size = "md" }: ParticipantChipProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8";
  const bubbleClasses = size === "sm" ? "h-8 w-8 p-1" : "h-10 w-10 p-1";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${bubbleClasses} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: getSoftAvatarColor(persona.avatarColor) }}
      >
        <div
          className={`${sizeClasses} rounded-full flex items-center justify-center text-white`}
          style={{ backgroundColor: persona.avatarColor }}
        >
          {persona.name.charAt(0)}
        </div>
      </div>
      {showRole && (
        <div className="flex flex-col">
          <span className="text-sm text-foreground">{persona.name}</span>
          <span className="text-xs text-muted-foreground">{persona.role}</span>
        </div>
      )}
    </div>
  );
}
