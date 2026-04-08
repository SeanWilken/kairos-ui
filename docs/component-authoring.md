# Component Authoring Guide

Use this guide when adding or updating primitives in `src/components/ui`.

This guide intentionally follows shadcn/ui conventions for component structure, accessibility defaults, and composable APIs, then layers Kairos packaging/boundary rules on top.

## Authoring rules

## 1) API design

- Keep APIs small and composable.
- Prefer native/Radix prop passthrough.
- Add new props only when they remove hardcoded behavior.
- Avoid one-off props tied to one app screen.

## 2) Configurability

- Every stylable component should accept `className`.
- Internal affordances (icons, labels, close controls) should support prop overrides where practical.
- Do not hardcode domain copy inside primitives.

## 3) Accessibility

- Preserve semantic elements and ARIA behavior.
- Keep keyboard and focus behavior intact.
- Include visually-hidden labels for icon-only affordances.

## 4) Boundaries

- Do not import from `kairos-core`, `kairos-studio`, or app repos.
- Do not perform data fetching.
- Do not include business logic in primitives.

## 5) Styling

- Use existing tokens and utility conventions.
- Prefer variant patterns (`cva`) for structured style options.
- Keep defaults sensible, but easy to override.

## PR checklist

- [ ] Component exports added to `src/index.ts`
- [ ] API is documented in `README.md` or docs
- [ ] No framework/domain coupling introduced
- [ ] Typecheck/build pass locally
- [ ] Changelog updated for behavior changes
