# 07 - Contributing Components

Contributions follow shadcn/ui-inspired conventions with Kairos boundary rules.

## Core expectations

- Keep primitives generic and composable.
- Favor prop-driven behavior over hardcoded content.
- Support `className` and pass-through props.
- Preserve accessibility semantics and keyboard support.

## Required boundaries

- No app-specific business logic in shared primitives.
- No imports from `kairos-core`, `kairos-studio`, or app repos.
- Keep data mapping in the consuming app layer.

## PR checklist

- Export from `src/index.ts`
- Document API/usage updates in docs
- Update `CHANGELOG.md`
- Ensure build/typecheck pass

## References

- `CONTRIBUTING.md`
- `docs/component-authoring.md`
- `ACKNOWLEDGMENTS.md`
