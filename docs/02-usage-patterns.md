# 02 - Usage Patterns

Use these patterns to keep components generic and app-ready.

## Pass data through props

```tsx
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@kairos/ui";

type ServiceStatus = {
  name: string;
  state: "healthy" | "degraded";
};

export function StatusCard({ status }: { status: ServiceStatus }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{status.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant={status.state === "healthy" ? "default" : "destructive"}>
          {status.state}
        </Badge>
      </CardContent>
    </Card>
  );
}
```

## Prefer app wrappers for product defaults

```tsx
import { Button, type ButtonProps } from "@kairos/ui";

export function PrimaryActionButton(props: ButtonProps) {
  return <Button variant="default" size="sm" {...props} />;
}
```

## Override internal affordances when needed

```tsx
import { Dialog, DialogContent, DialogTitle } from "@kairos/ui";
import { X } from "lucide-react";

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogContent closeIcon={<X />} closeLabel="Close settings" showCloseButton>
        <DialogTitle>Settings</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
```

## Keep boundary mapping in the app

- Map SDK/core contracts to view-model data in the app repo.
- Render that mapped data with `@kairos/ui` primitives.
- Avoid domain logic inside shared components.
