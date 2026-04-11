# 07 - Contributing Components

Contributions follow shadcn/ui-inspired conventions with Kairos boundary rules.

## Core expectations

- Keep primitives generic and composable.
- Favor prop-driven behavior over hardcoded content.
- Support `className` and pass-through props.
- For slot-based components, support `classNames` and `slotProps` for internal element customization.
- Preserve accessibility semantics and keyboard support.
- Keep `asChild` usage ref-safe via `forwardRef`.

## Required boundaries

- No app-specific business logic in shared primitives.
- No imports from `kairos-core`, `kairos-studio`, or app repos.
- Keep data mapping in the consuming app layer.
- Tailwind/daisyUI integration must remain optional (no hard dependency in primitive behavior).

## PR checklist

- Export from `src/index.ts`
- Document API/usage updates in docs
- Update `CHANGELOG.md`
- Ensure build/typecheck pass

## References

- `CONTRIBUTING.md`
- `docs/component-authoring.md`
- `ACKNOWLEDGMENTS.md`
- https://ui.shadcn.com/
- https://github.com/shadcn-ui/ui
