# 04 - Theming and Overrides

`@kairosstack/ui` supports multiple styling modes.

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
