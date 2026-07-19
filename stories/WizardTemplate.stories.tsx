import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Database, Rocket, ShieldCheck } from "lucide-react";

import {
  OnboardingWizardTemplate,
  SetupWizardTemplate,
  WizardTemplate,
  type WizardStep,
} from "../src";

const steps: WizardStep[] = [
  {
    id: "runtime",
    label: "Runtime",
    description: "Modes and connections",
    icon: Database,
  },
  {
    id: "deploy",
    label: "Deployment",
    description: "Target and infra",
    icon: Rocket,
  },
  {
    id: "verify",
    label: "Verify",
    description: "Checks and approvals",
    icon: ShieldCheck,
  },
];

const meta = {
  title: "Composites/Wizard Template",
  component: WizardTemplate,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Wizard title shown in the rail and header." },
    description: { control: "text", description: "Optional summary description for the flow." },
    currentStepId: { control: "text", description: "Currently active step id." },
    contextText: { control: "text", description: "Context summary shown above the panel body." },
    canGoBack: { control: "boolean", description: "Enables or disables the back action." },
    canGoNext: { control: "boolean", description: "Enables or disables the continue action." },
  },
  args: {
    title: "Environment Setup",
    description: "Configure infrastructure and runtime integration.",
    currentStepId: "runtime",
    contextText: "Tenant: acme-dev",
    canGoBack: false,
    canGoNext: true,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Domain-neutral step flow shell used for setup, onboarding, and other page-level guided flows. Keep step state, validation, and persistence in app adapters while reusing this shared rail/panel/progress structure.",
      },
    },
  },
} satisfies Meta<typeof WizardTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

function WizardTemplateStory({
  preset = "base",
}: {
  preset?: "base" | "setup" | "onboarding";
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentStep = steps[currentIndex];
  const completedStepIds = steps.slice(0, currentIndex).map((step) => step.id);

  const body = (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-base font-semibold">{currentStep.label}</h3>
        <p className="text-sm text-muted-foreground">{currentStep.description}</p>
      </div>
      <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        App-owned step content renders here. Use this shell for setup/onboarding flows while keeping validation, persistence,
        and domain contracts local to the consuming application.
      </div>
    </div>
  );

  const sharedProps = {
    steps,
    currentStepId: currentStep.id,
    completedStepIds,
    contextText: "Tenant: acme-dev",
    contextValues: {
      Tenant: "acme-dev",
      Environment: "local",
    },
    mode: "setup",
    modeOptions: {
      setup: "setup",
      runtime: "runtime",
    },
    onModeChange: () => undefined,
    canGoBack: currentIndex > 0,
    canGoNext: currentIndex < steps.length - 1,
    onBack: () => setCurrentIndex((index) => Math.max(0, index - 1)),
    onNext: () => setCurrentIndex((index) => Math.min(steps.length - 1, index + 1)),
    children: body,
  };

  if (preset === "setup") {
    return <SetupWizardTemplate {...sharedProps} />;
  }

  if (preset === "onboarding") {
    return <OnboardingWizardTemplate {...sharedProps} />;
  }

  return (
    <WizardTemplate
      {...sharedProps}
      title="Environment Setup"
      description="Configure infrastructure and runtime integration."
    />
  );
}

export const BaseTemplate: Story = {
  render: () => <WizardTemplateStory preset="base" />,
};

export const SetupPreset: Story = {
  render: () => <WizardTemplateStory preset="setup" />,
};

export const OnboardingPreset: Story = {
  render: () => <WizardTemplateStory preset="onboarding" />,
};
