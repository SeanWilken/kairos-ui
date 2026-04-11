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

type WizardModeOption = {
  id: WizardMode;
  label: string;
};

type WizardTemplateProps = {
  steps: WizardStep[];
  currentStepId: string;
  completedStepIds?: string[];
  title: React.ReactNode;
  description?: React.ReactNode;
  contextText?: React.ReactNode;
  children: React.ReactNode;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextLabel?: React.ReactNode;
  backLabel?: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  mode?: WizardMode;
  modeOptions?: WizardModeOption[];
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
  title?: React.ReactNode;
  description?: React.ReactNode;
};

function WizardTemplate({
  steps,
  currentStepId,
  completedStepIds = [],
  title,
  description,
  contextText,
  children,
  canGoBack = true,
  canGoNext = true,
  nextLabel = "Continue",
  backLabel = "Back",
  onNext,
  onBack,
  mode,
  modeOptions,
  onModeChange,
  className,
  classNames,
}: WizardTemplateProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const completedSet = React.useMemo(() => new Set(completedStepIds), [completedStepIds]);
  const completedCount = steps.filter((step) => completedSet.has(step.id)).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

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
        <aside
          data-slot="wizard-template-rail"
          className={cn("border-r bg-background", classNames?.rail)}
        >
          <div className={cn("border-b px-4 py-4", classNames?.railHeader)}>
            <div className="text-sm font-semibold">{title}</div>
            {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}

            {mode && modeOptions && modeOptions.length > 0 && onModeChange ? (
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-md border bg-muted/40 p-1">
                {modeOptions.map((modeOption) => (
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
                <span>{completedCount} of {steps.length} complete</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          </div>

          <nav data-slot="wizard-template-rail-nav" className={cn("space-y-0.5 p-3", classNames?.railNav)}>
            {steps.map((step, index) => {
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
                      <div className={cn("mt-0.5 truncate text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
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
              {backLabel}
            </Button>
            <Button onClick={onNext} disabled={!canGoNext}>
              {nextLabel}
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
  WizardMode,
  WizardModeOption,
  WizardPresetTemplateProps,
  WizardStep,
  WizardTemplateProps,
};
