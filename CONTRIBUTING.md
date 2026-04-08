# Contributing to @kairos/ui

Thanks for contributing.

This library is intentionally:

- open-source
- contract-agnostic
- configurable
- safe to consume across multiple apps

Please also see `ACKNOWLEDGMENTS.md` for upstream credits, especially the foundational influence of shadcn/ui.

Contributor conventions in this repo are aligned with shadcn/ui component patterns unless there is a clear Kairos boundary or packaging reason to diverge.

## Ground rules

1. Keep components domain-neutral.
2. Prefer composition over one-off abstractions.
3. Do not bake app-specific text, data fetching, auth, or API assumptions into primitives.
4. Expose behavior via props when a choice is likely app-specific.
5. Preserve accessibility semantics (labels, roles, keyboard behavior, focus states).

## Development workflow

1. Create a focused branch.
2. Implement a single coherent change.
3. Run local checks:
   - `bun run typecheck`
   - `bun run build`
4. Update docs when API or behavior changes.
5. Add a `CHANGELOG.md` entry for non-doc changes.

## Component contribution checklist

Use this checklist before opening a PR:

- API is minimal and composable.
- All native/Radix props are forwarded.
- `className` is supported on stylable parts.
- Optional behaviors are prop-driven (not hardcoded).
- No `kairos-core` or app-domain imports.
- File exports are added to `src/index.ts`.
- Documentation includes usage and overrides.

## Pull request expectations

- Keep PRs small and reviewable.
- Explain why the change improves library quality or flexibility.
- Include migration notes for breaking changes.
- Use Conventional Commit style when possible (`feat:`, `fix:`, `docs:`, etc.).

## Need design guidance?

See:

- `docs/component-authoring.md`
- `docs/styling.md`
