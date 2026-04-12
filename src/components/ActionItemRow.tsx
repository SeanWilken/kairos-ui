import { ActionItem, Persona } from "../types";
import { Circle, CircleDot, CheckCircle2, Calendar } from "lucide-react";

interface ActionItemRowProps {
  item: ActionItem;
  assignee?: Persona | null;
  resolvePersona?: (personaId: string) => Persona | null | undefined;
}

export function ActionItemRow({ item, assignee, resolvePersona }: ActionItemRowProps) {
  const resolvedAssignee =
    assignee ?? (item.assignee && resolvePersona ? resolvePersona(item.assignee) : null);

  const statusIcon = {
    pending: <Circle className="w-4 h-4 text-muted-foreground" />,
    in_progress: <CircleDot className="w-4 h-4 text-primary" />,
    complete: <CheckCircle2 className="w-4 h-4 text-primary" />,
  }[item.status];

  const isOverdue = item.dueDate && item.dueDate < new Date() && item.status !== "complete";

  return (
    <div className="flex items-start gap-3 py-2 px-3 rounded hover:bg-accent/50 transition-colors">
      <div className="mt-0.5">{statusIcon}</div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground">{item.content}</div>

        <div className="flex items-center gap-3 mt-1">
          {resolvedAssignee && (
            <span className="text-xs text-muted-foreground">
              {resolvedAssignee.name}
            </span>
          )}
          {item.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
              <Calendar className="w-3 h-3" />
              {item.dueDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
