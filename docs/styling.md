# Styling Guide

`@kairosstack/ui` supports multiple styling strategies so consumers can adopt it incrementally.

## Modes

### Default package styles

Use this when you want the library defaults:

```tsx
import "@kairosstack/ui/styles.css";
```

This path assumes your app has Tailwind v4 tooling available.

### Theme tokens only

Use this when you want shared CSS variables but custom utility/component styles:

```tsx
import "@kairosstack/ui/theme.css";
```

### Fully custom

Import components only and style entirely in your app or fork.

## Overriding strategy

1. Start with `className` on component instances.
2. Override token values (`--background`, `--primary`, etc.) in your app theme.
3. If needed, fork and extend variant APIs.

## daisyUI compatibility

daisyUI is intentionally not bundled.

You can use daisyUI in the consuming app and combine it with `@kairosstack/ui` by:

- choosing token values that align with your daisy theme
- overriding component classes where visual language differs
- creating app-level wrappers for opinionated product patterns
