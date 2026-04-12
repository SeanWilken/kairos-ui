import * as React from "react";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";

import { Button } from "./button";
import { Progress } from "./progress";
import { cn } from "./utils";

type WizardMode = string;

type WizardStep = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type WizardStepRecordItem = {
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type WizardStepRecord = Record<string, WizardStepRecordItem>;

type WizardModeOption = {
  id: WizardMode;
  label: string;
};

type WizardModeOptionRecord = Record<string, string>;
type WizardStringRecord = Record<string, string>;

type WizardLabels = {
  back?: string;
  next?: string;
  progressComplete?: string;
};

type WizardTemplateProps = {
  steps: WizardStep[] | WizardStepRecord;
  currentStepId: string;
  completedStepIds?: string[];
  title: string;
  description?: string;
  contextText?: string;
  contextValues?: WizardStringRecord;
  children: React.ReactNode;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextLabel?: string;
  backLabel?: string;
  labels?: WizardLabels;
  onNext?: () => void;
  onBack?: () => void;
  mode?: WizardMode;
  modeOptions?: WizardModeOption[] | WizardModeOptionRecord;
  onModeChange?: (mode: WizardMode) => void;
  className?: string;
  classNames?: {
    root?: string;
    rail?: string;
    railHeader?: string;
    railNav?: string;
    panel?: string;
    panelHeader?: string;
    panelBody?: string;
    panelFooter?: string;
  };
};

type WizardPresetTemplateProps = Omit<WizardTemplateProps, "title" | "description"> & {
  title?: string;
  description?: string;
};

function normalizeSteps(steps: WizardTemplateProps["steps"]): WizardStep[] {
  if (Array.isArray(steps)) return steps;
  return Object.entries(steps).map(([id, value]) => ({
    id,
    label: value.label,
    description: value.description,
    icon: value.icon,
  }));
}

function normalizeModeOptions(modeOptions: WizardTemplateProps["modeOptions"]): WizardModeOption[] {
  if (!modeOptions) return [];
  if (Array.isArray(modeOptions)) return modeOptions;
  return Object.entries(modeOptions).map(([id, label]) => ({ id, label }));
}

function WizardTemplate({
  steps,
  currentStepId,
  completedStepIds = [],
  title,
  description,
  contextText,
  contextValues,
  children,
  canGoBack = true,
  canGoNext = true,
  nextLabel,
  backLabel,
  labels,
  onNext,
  onBack,
  mode,
  modeOptions,
  onModeChange,
  className,
  classNames,
}: WizardTemplateProps) {
  const normalizedSteps = React.useMemo(() => normalizeSteps(steps), [steps]);
  const normalizedModeOptions = React.useMemo(() => normalizeModeOptions(modeOptions), [modeOptions]);

  const currentIndex = normalizedSteps.findIndex((step) => step.id === currentStepId);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const completedSet = React.useMemo(() => new Set(completedStepIds), [completedStepIds]);
  const completedCount = normalizedSteps.filter((step) => completedSet.has(step.id)).length;
  const progress = normalizedSteps.length > 0 ? (completedCount / normalizedSteps.length) * 100 : 0;
  const progressLabel = labels?.progressComplete ?? "complete";
  const backButtonLabel = backLabel ?? labels?.back ?? "Back";
  const nextButtonLabel = nextLabel ?? labels?.next ?? "Continue";
  const hasContextValues = !!contextValues && Object.keys(contextValues).length > 0;

  return (
    <div
      data-slot="wizard-template"
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        classNames?.root,
        className,
      )}
    >
      <div className="grid min-h-[680px] grid-cols-1 lg:grid-cols-[248px_1fr]">
        <aside data-slot="wizard-template-rail" className={cn("border-r bg-background", classNames?.rail)}>
          <div className={cn("border-b px-4 py-4", classNames?.railHeader)}>
            <div className="text-sm font-semibold">{title}</div>
            {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}

            {mode && normalizedModeOptions.length > 0 && onModeChange ? (
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-md border bg-muted/40 p-1">
                {normalizedModeOptions.map((modeOption) => (
                  <button
                    key={modeOption.id}
                    type="button"
                    onClick={() => onModeChange(modeOption.id)}
                    className={cn(
                      "rounded px-2 py-1 text-[11px] font-semibold transition-colors",
                      mode === modeOption.id
                        ? "border bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {modeOption.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{completedCount} of {normalizedSteps.length} {progressLabel}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {hasContextValues ? (
              <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                {Object.entries(contextValues).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="font-medium text-foreground">{key}:</dt>
                    <dd className="truncate">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <nav data-slot="wizard-template-rail-nav" className={cn("space-y-0.5 p-3", classNames?.railNav)}>
            {normalizedSteps.map((step, index) => {
              const done = completedSet.has(step.id);
              const active = index === activeIndex;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  data-slot="wizard-template-step"
                  data-active={active ? "true" : "false"}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                        ? "text-foreground hover:bg-muted"
                        : "text-muted-foreground",
                  )}
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    {done && !active ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium leading-none">{step.label}</div>
                    {step.description ? (
                      <div
                        className={cn(
                          "mt-0.5 truncate text-xs",
                          active ? "text-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {step.description}
                      </div>
                    ) : null}
                  </div>
                  {active ? <ChevronRight className="ml-auto h-3.5 w-3.5 flex-shrink-0 opacity-80" /> : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <section data-slot="wizard-template-panel" className={cn("flex min-w-0 flex-col", classNames?.panel)}>
          <header
            data-slot="wizard-template-panel-header"
            className={cn("border-b px-5 py-4 sm:px-6", classNames?.panelHeader)}
          >
            <div className="text-sm font-semibold">{title}</div>
            {contextText ? <p className="mt-1 text-xs text-muted-foreground">{contextText}</p> : null}
            {hasContextValues ? (
              <dl className="mt-2 grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                {Object.entries(contextValues).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <dt className="font-medium text-foreground">{key}:</dt>
                    <dd className="truncate">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </header>

          <div
            data-slot="wizard-template-panel-body"
            className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6", classNames?.panelBody)}
          >
            {children}
          </div>

          <footer
            data-slot="wizard-template-panel-footer"
            className={cn("flex items-center justify-between border-t px-5 py-3 sm:px-6", classNames?.panelFooter)}
          >
            <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
              {backButtonLabel}
            </Button>
            <Button onClick={onNext} disabled={!canGoNext}>
              {nextButtonLabel}
            </Button>
          </footer>
        </section>
      </div>
    </div>
  );
}

function SetupWizardTemplate({
  title = "Environment Setup",
  description = "Configure infrastructure and runtime integration.",
  ...props
}: WizardPresetTemplateProps) {
  return <WizardTemplate title={title} description={description} {...props} />;
}

function OnboardingWizardTemplate({
  title = "Onboarding",
  description = "Complete initial tenant and workspace configuration.",
  ...props
}: WizardPresetTemplateProps) {
  return <WizardTemplate title={title} description={description} {...props} />;
}

export { OnboardingWizardTemplate, SetupWizardTemplate, WizardTemplate };
export type {
  WizardLabels,
  WizardMode,
  WizardModeOption,
  WizardModeOptionRecord,
  WizardPresetTemplateProps,
  WizardStep,
  WizardStepRecord,
  WizardStepRecordItem,
  WizardStringRecord,
  WizardTemplateProps,
};
