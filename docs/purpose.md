# Purpose and Scope

`@myai-tech/myui` exists to provide reusable UI building blocks that can be shared across myAI apps and external projects.

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

- `myai-core` remains source of domain/runtime truth.
- Product repos map domain data to view-model props.
- `@myai-tech/myui` renders those props without importing domain contracts.
