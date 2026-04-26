# 11 - Studio Login Page

`StudioLogin` is the canonical shared login surface for Kairos frontends.

It preserves the Studio login visual language while keeping auth wiring in each consuming app.

## Export

```tsx
import { AuthLoginPage } from "@kairosstack/ui";
import type { LoginFormPayload } from "@kairosstack/ui";
```

Primary shared component:

```tsx
import { StudioLogin } from "@kairosstack/ui";
```

## Why this component exists

- Keep auth entry UX consistent across Studio, Council, Core frontends.
- Keep routing/API/session logic in app layer.
- Avoid repeated one-off login markup and styling drift.

`AuthLoginPage` remains available as a convenience wrapper with internal form state.

## Basic usage (recommended)

Use `StudioLogin` directly when you want app-controlled field state.

```tsx
import { StudioLogin } from "@kairosstack/ui";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <StudioLogin
      appName="Kairos"
      welcomeTitle="Council"
      welcomeDescription="Coordinate councils with AI and human context."
      formTitle="Welcome back"
      formDescription="Sign in to continue"
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={(event) => {
        event.preventDefault();
        void login(email, password);
      }}
    />
  );
}
```

## Wrapper usage

Use `AuthLoginPage` when you want the component to own local email/password/loading/error behavior.

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

- `StudioLogin` is the preferred baseline component.
- `onSubmit` is required and async-safe.
- Throw from `onSubmit` to show an error alert in the component.
- `notice` can be used for contextual banners (for example post-bootstrap success).
- Remember-me, forgot-password, and request-access actions are optional and can be hidden.

## App-layer responsibilities

- API calls and token handling
- session persistence
- redirects/navigation
- tenant/org context
