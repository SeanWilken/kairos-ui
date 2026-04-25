# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [Unreleased]

### Added

- Added reusable profile/resume builder components for persona and human profile flows (`ProfileBuilderWizard`, `ProfileTypeSelector`, `ProfileResumeCard`).
- Added reusable contact-style profile presentation components for directory/grid use (`ProfileCard`, `ProfileCardGrid`).
- Added shared profile contract types (`ProfileDraft`, trait/skill/tool/model option types) and exported them from package root.
- Added implementation and usage documentation for profile builder and card/grid consumption (`docs/10-profile-builder-and-cards.md`).

### Changed

- Expanded component authoring baseline with slot-level customization guidance (`classNames`, `slotProps`) and ref-safe `asChild` expectations.
- Added theming baseline guidance for light/dark token support with Tailwind/daisyUI as optional integrations only.
- Added planned composite component targets (`PageWrapper`, `Hero`) and associated API expectations.
- Added configurable skeleton variants and convenience loaders (`SkeletonText`, `SkeletonMenu`).
- Added slot-level class map support for menu surfaces (`DropdownMenuContent`, `SelectContent`) to allow targeted item/content customization.
- Updated usage docs with optimistic UI and skeleton loading patterns using TanStack Query.
- Added reusable layout composites for app pages and shell structure (`AppShell*`, `PageWrapper*`, `Hero*`) with slot-level class map support.

## [0.1.0] - 2026-04-07

### Added

- Initial standalone `@kairosstack/ui` package scaffolding.
- Shared UI primitive exports and style entrypoints.
- Documentation baseline for usage and contribution.
- Kairos app integration guide for `studio` and `core` frontends.
- CI workflow to validate typecheck and build on push/PR.
- GitHub-friendly docs hub and numbered walkthrough pages for setup, usage, catalog, theming, adoption, and alpha publishing.
- Screenshot documentation pathing under `docs/images/` for UI reference in guides.
- Studio screen map doc linking screenshots to practical component usage patterns.

### Changed

- Removed framework-specific `next-themes` coupling from toaster primitive.
- Expanded configurability for selected component internals via props.
- Added icon/affordance override props for checkbox/select/dropdown/tooltip and command/dialog primitives.
- Added migration playbook for Studio and Core frontend rollouts.
