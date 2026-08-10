# 04 - Theming and Overrides

`@myai-tech/myui` supports multiple styling modes.

## Included themes

The package includes semantic color palettes selected with `data-theme`:

- `light` (also the `:root` default)
- `dark` (also available with the legacy `.dark` class)
- `myai` or `night` for the branded indigo dark palette
- `corporate` for a cool blue light palette
- `business` for a teal dark palette

```ts
document.documentElement.dataset.theme = "myai";
```

These names intentionally work alongside daisyUI's `data-theme` convention. daisyUI remains optional; myUI maps the attribute to its own semantic tokens without requiring it.

## Default package styles

```tsx
import "@myai-tech/myui/styles.css";
```

Use this for fastest setup.

## Theme tokens only

```tsx
import "@myai-tech/myui/theme.css";
```

Use this when your app owns most styling but wants shared token names.

Example custom token override:

```css
[data-theme="custom"] {
  --background: #0b1220;
  --foreground: #f8fafc;
  --primary: #22c55e;
  --primary-foreground: #052e16;
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

- align app theme values with myAI UI tokens
- keep daisy-specific assumptions in app wrappers
- avoid introducing daisy-specific coupling inside shared primitives

## Tailwind compatibility

Tailwind is also optional. Consumers can:

- use package CSS directly,
- import theme tokens only,
- or run fully app-owned styling.

The default `styles.css` scans the package's shipped `dist` bundle, so consumers do not need to add an `@source` workaround for myUI component utilities. Apps only need their normal source detection for app-owned utility classes.

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
} from "@myai-tech/myui";

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
