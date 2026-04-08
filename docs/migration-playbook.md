# Migration Playbook (Studio and Core Frontends)

Use this playbook when replacing local UI components with `@kairosstack/ui`.

## Step 1: Baseline

- Capture current screenshots for target screens.
- Note any app-specific wrappers that should remain local.

## Step 2: Swap low-risk primitives first

- Button
- Input
- Label
- Textarea
- Card

Commit and validate before moving on.

## Step 3: Swap interaction-heavy primitives

- Select
- Dialog
- Dropdown Menu
- Tooltip
- Tabs

Validate keyboard nav, focus rings, and disabled states.

## Step 4: Keep app-level wrappers

If Studio/Core has product-specific defaults, use wrappers in those repos instead of adding product-specific props to `@kairosstack/ui`.

## Step 5: Resolve style mismatches

- Override with `className` first.
- If mismatch repeats, add app wrapper.
- Only change shared defaults when multiple consumers need it.

## Step 6: Final checks

- Unit/integration tests pass in consuming repo.
- No visual regressions on key pages.
- No app-domain logic moved into shared library.
