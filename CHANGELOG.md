# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

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
