# @kairos/ui

Open-source React UI primitives for Kairos apps and external consumers.

`@kairos/ui` is a building-block library. It focuses on composition, accessibility, and configurability instead of app-specific workflows.

## Purpose

- Provide reusable, contract-agnostic UI primitives.
- Keep domain logic in app repos (`core`, `studio`, etc.), not in UI components.
- Support multiple styling paths: default theme, custom tokens, or fully custom styles.

## Design principles

- Framework agnostic: no direct dependency on app frameworks.
- Styling optional: import package styles when you want the default look.
- Override friendly: pass `className`, extend variants, or replace tokens.
- Accessible by default: built on Radix primitives where applicable.

## Installation

```bash
npm install @kairos/ui@alpha
```

Or with Bun:

```bash
bun add @kairos/ui@alpha
```

## Documentation

- Full docs hub: `docs/README.md`
- Getting started: `docs/01-getting-started.md`
- Component usage patterns: `docs/02-usage-patterns.md`
- Component catalog: `docs/03-component-catalog.md`
- Theming and overrides: `docs/04-theming-and-overrides.md`
- Kairos adoption guide: `docs/05-kairos-adoption-guide.md`
- Studio screen map: `docs/08-studio-screen-map.md`
- Release/publishing flow: `docs/06-release-and-publishing.md`

## Quick start

```tsx
import { Button } from "@kairos/ui";
import "@kairos/ui/styles.css";

export function Example() {
  return <Button>Save</Button>;
}
```

## Styling modes

### 1) Default styles (fastest)

Import once in your app entry:

```tsx
import "@kairos/ui/styles.css";
```

### 2) Theme-only tokens

If you want your own utility/classes but still want shared token names:

```tsx
import "@kairos/ui/theme.css";
```

### 3) No package styles

Import components only, then style them completely in your app/fork.

## Tailwind and daisyUI

- Tailwind is optional at the package level.
- If you use `@kairos/ui/styles.css`, your app should include Tailwind v4 tooling.
- daisyUI is not a dependency of this package; you can layer daisyUI in your app and override classes/tokens as needed.

See `docs/styling.md` for recommended override patterns.

## Configurability expectations

- Components support `className` and pass-through native/Radix props.
- Where internal affordances exist (icons/labels/close controls), prefer prop-based overrides over hardcoded behavior.
- Domain data mapping should happen in app-layer view-model adapters, not inside this package.

## Kairos app integration

For `kairos-studio` and `kairos-core` frontend adoption, follow:

- `docs/consuming-in-kairos-apps.md`
- `docs/migration-playbook.md`

## Contributing

Start with `CONTRIBUTING.md` and `docs/component-authoring.md`.

## License

MIT. See `LICENSE`.

## Attribution

Huge credit to [shadcn/ui](https://ui.shadcn.com/) for the component patterns, accessibility-forward defaults, and template guidance that informed this library's foundation.

Many primitives in this repo are adapted from shadcn/ui examples and conventions, then extended for Kairos-specific packaging and cross-repo consumption.

shadcn/ui is licensed under MIT and can be found here:

- https://github.com/shadcn-ui/ui
- https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
