# Purpose and Scope

`@kairos/ui` exists to provide reusable UI building blocks that can be shared across Kairos apps and external projects.

## In scope

- Reusable primitives and low-level composites.
- Accessibility-first component behavior.
- Token-driven theme defaults.
- Composable APIs with prop-based overrides.

## Out of scope

- Domain contracts and data models.
- API clients and data fetching.
- App-specific business workflows.
- Product-specific copy baked into primitives.

## Boundary model

- `kairos-core` remains source of domain/runtime truth.
- Product repos map domain data to view-model props.
- `@kairos/ui` renders those props without importing domain contracts.
