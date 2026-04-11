# Component Authoring Guide

Use this guide when adding or updating primitives in `src/components/ui`.

This guide intentionally follows shadcn/ui conventions for component structure, accessibility defaults, and composable APIs, then layers Kairos packaging/boundary rules on top.

## Upstream reference

When adding or refactoring primitives, align structure and behavior with shadcn/ui first, then apply Kairos-specific packaging constraints:

- https://ui.shadcn.com/
- https://github.com/shadcn-ui/ui

## Authoring rules

## 1) API design

- Keep APIs small and composable.
- Prefer native/Radix prop passthrough.
- Add new props only when they remove hardcoded behavior.
- Avoid one-off props tied to one app screen.

## 2) Configurability

- Every stylable component should accept `className`.
- Components with meaningful internal slots should also accept `classNames` and `slotProps`.
- Internal affordances (icons, labels, close controls) should support prop overrides where practical.
- Do not hardcode domain copy inside primitives.

Recommended shape:

```ts
type ClassNameMap = Partial<Record<"root" | "trigger" | "content" | "item" | "icon" | "label", string>>

type SlotProps = {
  root?: Record<string, unknown>
  trigger?: Record<string, unknown>
  content?: Record<string, unknown>
  item?: Record<string, unknown>
}
```

When this pattern is used, keep slot names consistent across related families (`Select`, `DropdownMenu`, `Popover`, `Dialog`) so consumer helpers can reuse one mapping strategy.

## 3) Accessibility

- Preserve semantic elements and ARIA behavior.
- Keep keyboard and focus behavior intact.
- Include visually-hidden labels for icon-only affordances.
- `asChild` paths must remain ref-safe (`React.forwardRef`) for Radix `Slot` compatibility.

## 4) Boundaries

- Do not import from `kairos-core`, `kairos-studio`, or app repos.
- Do not perform data fetching.
- Do not include business logic in primitives.

## 5) Styling

- Use existing tokens and utility conventions.
- Prefer variant patterns (`cva`) for structured style options.
- Keep defaults sensible, but easy to override.
- Overlay components (`Select`, `DropdownMenu`, `Popover`) should expose placement and width controls and ship with non-transparent defaults.

## 6) Theme compatibility baseline

- Light and dark mode must be supported through CSS token themes.
- Tailwind and daisyUI can be used by consumers, but must remain optional integrations.
- Do not require Tailwind or daisyUI runtime in component logic.
- Provide defaults in package CSS, then allow token/class override layering from apps.

## 7) Composite components roadmap

Composites are allowed when they remain domain-neutral and reusable:

- `PageWrapper`: app shell content wrapper with responsive width, section spacing, and optional side rail slots.
- `Hero`: heading + supporting text + optional actions/media regions.

These should live as optional higher-level building blocks on top of existing primitives, not replacements for low-level exports.

## PR checklist

- [ ] Component exports added to `src/index.ts`
- [ ] API is documented in `README.md` or docs
- [ ] No framework/domain coupling introduced
- [ ] Typecheck/build pass locally
- [ ] Changelog updated for behavior changes
