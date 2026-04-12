import { Decision, Persona } from "../types";
import { CheckCircle2 } from "lucide-react";

interface DecisionCardProps {
  decision: Decision;
  participants?: Persona[];
  resolvePersona?: (personaId: string) => Persona | null | undefined;
}

export function DecisionCard({ decision, participants, resolvePersona }: DecisionCardProps) {
  const participantList =
    participants ??
    decision.participants
      .map((pid) => (resolvePersona ? resolvePersona(pid) : null))
      .filter((persona): persona is Persona => !!persona);

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm mb-1">{decision.content}</h4>
          <span className="text-xs text-muted-foreground">
            {decision.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Rationale</div>
          <div className="text-sm text-foreground">{decision.rationale}</div>
        </div>

        {decision.alternatives.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Alternatives Considered</div>
            <ul className="space-y-1">
              {decision.alternatives.map((alt, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {alt}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="text-xs text-muted-foreground mb-1">Participants</div>
          <div className="flex gap-2">
            {participantList.map((persona) => {
              return (
                <div
                  key={persona.id}
                  className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: persona.avatarColor }}
                  title={persona.name}
                >
                  {persona.name.charAt(0)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
