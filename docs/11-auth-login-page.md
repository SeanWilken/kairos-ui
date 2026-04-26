# 11 - Auth Login Page

`AuthLoginPage` is a reusable, app-agnostic login screen for Kairos frontends.

It mirrors the Studio login UX while keeping auth wiring in each consuming app.

## Export

```tsx
import { AuthLoginPage } from "@kairosstack/ui";
import type { LoginFormPayload } from "@kairosstack/ui";
```

## Why this component exists

- Keep auth entry UX consistent across Studio, Council, Core frontends.
- Keep routing/API/session logic in app layer.
- Avoid repeated one-off login markup and styling drift.

## Basic usage

```tsx
import { AuthLoginPage } from "@kairosstack/ui";

export function LoginScreen() {
  return (
    <AuthLoginPage
      appTitle="Kairos"
      heroTitle="Studio"
      welcomeDescription="Sign in to access your workspace"
      onSubmit={async ({ email, password, rememberMe }) => {
        void rememberMe;
        await login(email, password);
      }}
      onForgotPassword={() => {
        openForgotPassword();
      }}
      onRequestAccess={() => {
        openRequestAccess();
      }}
    />
  );
}
```

## Contract notes

- `onSubmit` is required and async-safe.
- Throw from `onSubmit` to show an error alert in the component.
- `notice` can be used for contextual banners (for example post-bootstrap success).
- Remember-me, forgot-password, and request-access actions are optional and can be hidden.

## App-layer responsibilities

- API calls and token handling
- session persistence
- redirects/navigation
- tenant/org context
