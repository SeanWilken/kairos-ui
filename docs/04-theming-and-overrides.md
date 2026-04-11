# 04 - Theming and Overrides

`@kairosstack/ui` supports multiple styling modes.

## Light and dark mode baseline

The package should support both light and dark themes via CSS tokens.

- Keep token names stable across modes.
- Implement mode switching through standard selectors (`:root`, `.dark`, or `[data-theme]`).
- Avoid hard-coding color values inside component logic.

## Default package styles

```tsx
import "@kairosstack/ui/styles.css";
```

Use this for fastest setup.

## Theme tokens only

```tsx
import "@kairosstack/ui/theme.css";
```

Use this when your app owns most styling but wants shared token names.

Example light/dark token pattern:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 4%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 4%;
}

.dark {
  --background: 240 10% 4%;
  --foreground: 0 0% 98%;
  --popover: 240 10% 8%;
  --popover-foreground: 0 0% 98%;
}
```

## Fully app-owned styling

Import components without package CSS and style through wrappers/class overrides.

## Token override example

```css
:root {
  --primary: #0b1220;
  --primary-foreground: #ffffff;
  --radius: 0.5rem;
}
```

## daisyUI compatibility

daisyUI is optional and app-level. If you use it:

- align app theme values with Kairos UI tokens
- keep daisy-specific assumptions in app wrappers
- avoid introducing daisy-specific coupling inside shared primitives

## Tailwind compatibility

Tailwind is also optional. Consumers can:

- use package CSS directly,
- import theme tokens only,
- or run fully app-owned styling.

When using Tailwind v4 with source scanning, consumer apps may need to include package paths in `@source` configuration if they rely on utility classes emitted from package component code.

## Slot-level menu overrides

Menu components support slot-level class maps for targeted overrides without app-wide CSS hacks.

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kairosstack/ui";

function MenuOverridesExample() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          classNames={{
            content: "bg-white border-zinc-300",
            item: "rounded-md",
            separator: "bg-zinc-200",
          }}
        >
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent
          classNames={{
            content: "bg-white border-zinc-300",
            item: "py-2",
            viewport: "p-2",
          }}
        >
          <SelectItem value="one">One</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
```
