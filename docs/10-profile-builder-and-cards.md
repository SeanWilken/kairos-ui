# 10 - Profile Builder and Cards

`@kairosstack/ui` includes a reusable profile builder system for:

- AI persona configuration
- human profile (resume-style) configuration
- contact card and grid views for people directories

These components are designed to be app-agnostic and callback-driven so `studio`, `core`, and future apps can share the same profile contract.

## Exports

```ts
import {
  ProfileBuilderWizard,
  ProfileTypeSelector,
  ProfileResumeCard,
  ProfileCard,
  ProfileCardGrid,
} from "@kairosstack/ui";

import type {
  ProfileDraft,
  ProfileKind,
  ProfileTraitOption,
  ProfileCommunicationOption,
  ProfileSkillGroup,
  ProfileToolGroup,
  ProfileModelOption,
} from "@kairosstack/ui";
```

## Core goals

- Keep profile capture aligned to familiar resume concepts.
- Capture interaction preferences for AI-led workflows.
- Produce reusable card-ready data for lists, directories, and contact grids.

## Minimal wizard usage

```tsx
import { ProfileBuilderWizard } from "@kairosstack/ui";
import type { ProfileDraft } from "@kairosstack/ui";

export function PersonaBuilderPage() {
  return (
    <ProfileBuilderWizard
      kind="persona"
      onChange={(draft: ProfileDraft) => {
        void draft;
      }}
      onComplete={(draft: ProfileDraft) => {
        // Persist in app layer
        // POST /profiles
        console.log("save", draft);
      }}
      onCancel={() => {
        // route back / close modal
      }}
    />
  );
}
```

## Human profile flow

```tsx
<ProfileBuilderWizard kind="human" onComplete={(draft) => saveHumanProfile(draft)} />
```

## Type selector first flow

When you want users to choose persona vs human first:

```tsx
<ProfileBuilderWizard allowTypeSelection onComplete={(draft) => saveProfile(draft)} />
```

## Contact cards and grid views

Use `ProfileCard` and `ProfileCardGrid` with the same `ProfileDraft` shape.

```tsx
import { ProfileCardGrid } from "@kairosstack/ui";

<ProfileCardGrid
  profiles={profiles}
  onSelect={(profile) => {
    openProfile(profile.id);
  }}
/>;
```

## Resume-style profile preview

```tsx
import { ProfileResumeCard } from "@kairosstack/ui";

<ProfileResumeCard profile={profile} />;
```

## Configuration surfaces

`ProfileBuilderWizard` supports configuration for option catalogs:

- `traitOptions`
- `communicationOptions`
- `skillGroups`
- `toolGroups`
- `modelOptions`

Use this when each app has different profile vocabularies but should still keep a shared schema.

## Persona integration fields

`ProfileDraft` includes optional persona-focused fields that apps can map directly to backend contracts:

- `orgId` (optional)
- `scope` (optional, e.g. `organization`, `team`, `tenant`)
- `modelProfile` (optional alias for `model`)
- `systemPromptOverride` (optional)

Notes:

- `model` remains the base shared field and is still supported.
- `ProfileBuilderWizard` keeps `model` and `modelProfile` in sync when selecting a model in the Capabilities step.
- If `initialProfile` changes after first render, the wizard now rehydrates the draft so edit/prefill flows can refresh in place.

## Suggested app-layer storage contract

Persist a `ProfileDraft` (or mapped domain equivalent) with:

- identity and contact fields
- communication preferences
- skills and traits
- behavior guidelines and guardrails
- persona capabilities (`tools`, `model` / `modelProfile`) when `kind === "persona"`
- optional persona targeting (`orgId`, `scope`) and prompt override (`systemPromptOverride`)

Example backend mapping for persona apps:

- `draft.orgId` -> `org_id`
- `draft.scope` -> `scope`
- `draft.modelProfile || draft.model` -> `model_profile`
- `draft.systemPromptOverride` -> `system_prompt`
- `draft.tools` -> `data.tools`
- `draft.guidelines` -> `data.do_list`, `data.dont_list`, `data.guardrails` (app adapter decides exact shape)

This allows consistent rendering in cards, grids, and ledger-aware interaction flows.
