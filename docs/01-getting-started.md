# 01 - Getting Started

This guide gets a consumer app running with `@myai-tech/myui` quickly.

## Requirements

- React 18+
- Tailwind v4 if you use `@myai-tech/myui/styles.css`

## Install from npm (alpha)

```bash
bun add @myai-tech/myui@alpha
```

Or:

```bash
npm install @myai-tech/myui@alpha
```

## Use in app entry

```tsx
import "@myai-tech/myui/styles.css";
```

## Use in components

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "@myai-tech/myui";

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
