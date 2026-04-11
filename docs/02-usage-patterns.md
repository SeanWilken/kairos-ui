# 02 - Usage Patterns

Use these patterns to keep components generic and app-ready.

## Pass data through props

```tsx
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@kairosstack/ui";

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
import { Button, type ButtonProps } from "@kairosstack/ui";

export function PrimaryActionButton(props: ButtonProps) {
  return <Button variant="default" size="sm" {...props} />;
}
```

## Override internal affordances when needed

```tsx
import { Dialog, DialogContent, DialogTitle } from "@kairosstack/ui";
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
- Render that mapped data with `@kairosstack/ui` primitives.
- Avoid domain logic inside shared components.

## Optimistic UI and skeleton loaders

For API-driven screens, prefer optimistic interactions with clear rollback behavior and loading placeholders.

- Use optimistic updates for low-risk mutations (rename, toggle, reorder).
- Show inline pending states to prevent duplicate user actions.
- Use skeletons for first-load and section refetch states.

Example with TanStack Query + `SkeletonText`:

```tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, SkeletonText } from "@kairosstack/ui";

function PersonasList() {
  const queryClient = useQueryClient();
  const personas = useQuery({ queryKey: ["personas"], queryFn: fetchPersonas });

  const rename = useMutation({
    mutationFn: renamePersona,
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ["personas"] });
      const previous = queryClient.getQueryData<any[]>(["personas"]);
      queryClient.setQueryData<any[]>(["personas"], (rows = []) =>
        rows.map((r) => (r.id === id ? { ...r, name } : r)),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(["personas"], context?.previous ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
    },
  });

  if (personas.isLoading) return <SkeletonText lines={5} />;

  return <Button onClick={() => rename.mutate({ id: "p1", name: "Updated" })}>Rename</Button>;
}
```
