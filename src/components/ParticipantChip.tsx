import { Persona } from "../types";

interface ParticipantChipProps {
  persona: Persona;
  showRole?: boolean;
  size?: "sm" | "md";
}

export function ParticipantChip({ persona, showRole = true, size = "md" }: ParticipantChipProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center text-white`}
        style={{ backgroundColor: persona.avatarColor }}
      >
        {persona.name.charAt(0)}
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