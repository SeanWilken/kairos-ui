# 09 - Wizard Templates

`WizardTemplate` is a domain-neutral scaffold for setup and onboarding workflows across Kairos apps.

Also exported presets:

- `SetupWizardTemplate`
- `OnboardingWizardTemplate`

## Why this exists

- Keep step-by-step UX consistent across `core`, `studio`, and future frontends.
- Reuse layout and navigation shell while preserving app-level business logic.
- Avoid duplicating wizard sidebar/progress/footer code in each app repo.

## What it provides

- Left rail with step states, optional mode toggle, and completion progress.
- Main panel with title/context, body slot for per-step content, and back/continue actions.
- Styling hooks via `className` and slot-level `classNames`.
- String-first configuration that can be supplied via record objects.

## Type contracts

`WizardTemplate` supports both array and record-driven configuration.

```ts
type WizardStepRecord = Record<
  string,
  {
    label: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
>;

type WizardModeOptionRecord = Record<string, string>;
type WizardStringRecord = Record<string, string>;
```

Key props:

- `steps`: `WizardStep[] | WizardStepRecord`
- `modeOptions`: `WizardModeOption[] | WizardModeOptionRecord`
- `contextValues`: `WizardStringRecord`
- `title`, `description`, `contextText`, `nextLabel`, `backLabel`: `string`

## What it does not provide

- API logic, persistence, auth, role checks, or step-specific validation logic.
- Domain state shape for personas/users/orgs/documents.

Those stay in app-layer adapters.

## Core setup example

```tsx
import { SetupWizardTemplate } from "@kairosstack/ui";

const steps = {
  runtime: { label: "Runtime", description: "Modes and connections" },
  deploy: { label: "Deployment", description: "Target and infra" },
  verify: { label: "Runtime Verify", description: "Checks and ingest" },
};

export function CoreSetupWizardAdapter() {
  return (
    <SetupWizardTemplate
      steps={steps}
      currentStepId="runtime"
      completedStepIds={["runtime"]}
      contextText="Tenant: acme-dev"
      contextValues={{
        Tenant: "acme-dev",
        Environment: "local",
      }}
      mode="setup"
      modeOptions={{
        setup: "setup",
        runtime: "runtime",
      }}
      onModeChange={(nextMode) => {
        void nextMode;
      }}
      canGoBack={false}
      canGoNext
      onNext={() => {
        // app-level step advancement
      }}
    >
      {/* app-owned step component here */}
      <div>Step body...</div>
    </SetupWizardTemplate>
  );
}
```

## Studio onboarding ideas

- Persona creation flow
- Organization setup + user assignment flow
- Role/privilege provisioning flow
- Initial document ingest/vectorization flow

Each flow can use a thin adapter around the same shared wizard shell.

## Studio API proposal alignment

From `kairos-core/docs/architecture/onboarding-contracts-and-api-draft-v0.2.md`, the following feature groups map directly to wizard templates:

- Organization setup (`/v1/studio/organizations`)
- Persona management (`/v1/studio/personas`)
- Tool integration and validation (`/v1/studio/tools`, `/validate`)
- Workflow definition and dry-run (`/v1/studio/workflows`, `/dry-run`)
- Promotion approvals/applies (`/v1/studio/promotions`)

Recommended pattern: define each flow's steps and labels as record objects from API metadata/config, then render through `OnboardingWizardTemplate`.
