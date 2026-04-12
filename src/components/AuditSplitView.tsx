import { useState } from "react";
import { Message, MessageAuditData, Persona } from "../types";
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";

interface AuditSplitViewProps {
  message: Message;
  persona?: Persona | null;
  resolvePersona?: (personaId: string) => Persona | null | undefined;
  auditData?: MessageAuditData;
}

export function AuditSplitView({ message, persona, resolvePersona, auditData }: AuditSplitViewProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));
  const resolvedPersona =
    persona ?? (message.personaId && resolvePersona ? resolvePersona(message.personaId) : null);

  const fallbackAuditData: MessageAuditData = {
    messageId: message.id,
    personaId: message.personaId,
    reasoning: [
      {
        step: 1,
        description: "Analyzed current sprint velocity and capacity",
        confidence: 0.92,
        reasoning: "Based on the last 4 sprints, average velocity is 32 story points with 5 team members. This provides a baseline for planning.",
      },
      {
        step: 2,
        description: "Identified scope creep pattern",
        confidence: 0.85,
        reasoning: "Reviewing sprint logs shows 3-4 unplanned items per sprint over the last 6 sprints. This indicates a systematic issue rather than random occurrence.",
      },
      {
        step: 3,
        description: "Assessed technical debt impact",
        confidence: 0.78,
        reasoning: "Code complexity metrics show 15% increase over 3 months. This correlates with slower feature delivery in recent sprints.",
      },
      {
        step: 4,
        description: "Formulated recommendation",
        confidence: 0.85,
        reasoning: "Allocating 20% capacity to tech debt addresses the root cause while maintaining feature delivery. This is a standard industry practice.",
      },
    ],
    sources: [
      "Sprint velocity data (last 6 months)",
      "JIRA ticket analysis",
      "Code complexity metrics from SonarQube",
      "Industry best practices (Scrum Guide)",
    ],
    alternatives: [
      "Allocate 30% to tech debt (more aggressive)",
      "Create dedicated tech debt sprints (disruptive to flow)",
      "Maintain status quo and monitor (risky)",
    ],
    uncertainties: [
      "Exact percentage needed may vary by team",
      "Impact on Q2 roadmap timeline unclear",
    ],
  };

  const activeAuditData = auditData ?? fallbackAuditData;

  const toggleStep = (step: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(step)) {
      newExpanded.delete(step);
    } else {
      newExpanded.add(step);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div className="h-full overflow-auto bg-muted/30 p-6">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h3>Reasoning Audit</h3>
              {resolvedPersona && (
                <p className="text-sm text-muted-foreground">
                  {resolvedPersona.name} ({resolvedPersona.role})
                </p>
              )}
            </div>
          </div>
          <div className="px-4 py-3 rounded-lg bg-background border border-border">
            <div className="text-sm mb-1">Response:</div>
            <div className="text-sm text-muted-foreground">{message.content}</div>
          </div>
        </div>

        {/* Reasoning Steps */}
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Reasoning Process
          </h4>
          <div className="space-y-2">
            {activeAuditData.reasoning.map((step) => {
              const isExpanded = expandedSteps.has(step.step);
              const confidenceColor =
                step.confidence >= 0.9
                  ? "text-green-600"
                  : step.confidence >= 0.75
                  ? "text-blue-600"
                  : "text-yellow-600";

              return (
                <div
                  key={step.step}
                  className="border border-border rounded-lg bg-background overflow-hidden"
                >
                  <button
                    onClick={() => toggleStep(step.step)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">Step {step.step}</span>
                        <span className={`text-xs ${confidenceColor}`}>
                          {Math.round(step.confidence * 100)}% confidence
                        </span>
                      </div>
                      <div className="text-sm">{step.description}</div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pl-11">
                      <div className="pt-2 border-t border-border">
                        <div className="text-sm text-muted-foreground">{step.reasoning}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sources */}
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Information Sources
          </h4>
          <div className="space-y-2">
            {activeAuditData.sources.map((source, idx) => (
              <div
                key={idx}
                className="px-4 py-2 rounded-lg bg-background border border-border text-sm"
              >
                {source}
              </div>
            ))}
          </div>
        </div>

        {/* Alternatives Considered */}
        <div className="mb-6">
          <h4 className="mb-3">Alternatives Considered</h4>
          <div className="space-y-2">
            {activeAuditData.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="px-4 py-2 rounded-lg bg-background border border-border text-sm text-muted-foreground"
              >
                {alt}
              </div>
            ))}
          </div>
        </div>

        {/* Uncertainties */}
        {activeAuditData.uncertainties && activeAuditData.uncertainties.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              Uncertainties
            </h4>
            <div className="space-y-2">
              {activeAuditData.uncertainties.map((uncertainty, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 text-sm"
                >
                  {uncertainty}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
