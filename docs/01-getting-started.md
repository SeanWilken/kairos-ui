# 01 - Getting Started

This guide gets a consumer app running with `@kairos/ui` quickly.

## Requirements

- React 18+
- Tailwind v4 if you use `@kairos/ui/styles.css`

## Install from npm (alpha)

```bash
bun add @kairos/ui@alpha
```

Or:

```bash
npm install @kairos/ui@alpha
```

## Use in app entry

```tsx
import "@kairos/ui/styles.css";
```

## Use in components

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "@kairos/ui";

export function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Continue</Button>
      </CardContent>
    </Card>
  );
}
```

## Local development before publish

If you need to consume this repo before npm publish, use repo aliases in your app bundler/TypeScript config. After publish, switch to normal package installation.
