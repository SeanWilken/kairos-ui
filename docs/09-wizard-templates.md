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

## What it does not provide

- API logic, persistence, auth, role checks, or step-specific validation logic.
- Domain state shape for personas/users/orgs/documents.

Those stay in app-layer adapters.

## Core setup example

```tsx
import { SetupWizardTemplate } from "@kairosstack/ui";

const steps = [
  { id: "runtime", label: "Runtime", description: "Modes and connections" },
  { id: "deploy", label: "Deployment", description: "Target and infra" },
  { id: "verify", label: "Runtime Verify", description: "Checks and ingest" },
];

export function CoreSetupWizardAdapter() {
  return (
    <SetupWizardTemplate
      steps={steps}
      currentStepId="runtime"
      completedStepIds={["runtime"]}
      contextText="Tenant: acme-dev"
      mode="setup"
      modeOptions={[
        { id: "setup", label: "setup" },
        { id: "runtime", label: "runtime" },
      ]}
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
