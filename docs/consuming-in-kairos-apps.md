# Consuming in Kairos Apps

For the current GitHub docs walkthrough version of this guide, start at `docs/README.md` and `docs/05-kairos-adoption-guide.md`.

This guide covers how to adopt `@kairosstack/ui` in both Kairos app repos:

- `kairos-studio`
- `kairos-core` frontend/bootstrap surfaces

The goal is shared primitives with app-owned domain mapping.

## 1) Install

In each app repo:

```bash
bun add @kairosstack/ui@alpha
```

Until npm publishing is in place, use a local package workflow:

1. In `kairos-ui`, run `bun run build`.
2. Create a tarball (`npm pack` or Bun equivalent).
3. Install the tarball in `studio` and `core` frontend repos.

## 2) Import styles once

In your app entry (or top-level layout):

```tsx
import "@kairosstack/ui/styles.css";
```

If an app needs custom styling ownership, use one of:

- `@kairosstack/ui/theme.css` (tokens only)
- no style import (fully app-owned styles)

## 3) Keep boundaries clean

- Map core/sdk responses to view-model props in the app layer.
- Pass those props into `@kairosstack/ui` components.
- Do not move domain contracts into this package.

## 4) Migration strategy

Start with low-risk primitives:

1. `Button`
2. `Input`
3. `Label`
4. `Card`

Then migrate composite-heavy components (`Dialog`, `DropdownMenu`, `Select`, `Tabs`).

When migrating, prefer one feature area per PR so regressions are isolated.

## 5) App-specific wrappers (recommended)

Each consuming app can create its own wrappers around shared primitives for opinionated product behavior.

Example in app repo:

```tsx
import { Button, type ButtonProps } from "@kairosstack/ui";

export function PrimaryActionButton(props: ButtonProps) {
  return <Button variant="default" {...props} />;
}
```

This keeps the shared package generic while allowing local product personality.

## 6) Theming and daisyUI

daisyUI remains optional and app-level.

If a consuming app uses daisyUI:

- align app token values with `@kairosstack/ui` CSS variables
- override classes where needed through wrappers
- avoid pushing daisy-specific assumptions into shared primitives

## 7) Verification checklist per app

- Build passes with `@kairosstack/ui` imported.
- No domain contract imports from `@kairosstack/ui`.
- Keyboard/focus behavior still works after migration.
- Dark/light token overrides behave as expected.
- Critical forms still submit/validate correctly after primitive swaps.
- Visual diffs reviewed for spacing/typography drift.
