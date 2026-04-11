# 03 - Component Catalog

Current exported primitives from `@kairosstack/ui`:

## Layout and structure

- `Accordion`
- `AppShell`
- `AppShellSidebar`
- `AppShellMain`
- `AppShellHeader`
- `AppShellBody`
- `Card`
- `Hero`
- `HeroContent`
- `HeroHeading`
- `HeroTitle`
- `HeroDescription`
- `HeroActions`
- `HeroMedia`
- `PageWrapper`
- `PageHeader`
- `PageSection`
- `PageActions`
- `WizardTemplate`
- `SetupWizardTemplate`
- `OnboardingWizardTemplate`
- `Separator`
- `ScrollArea`
- `Skeleton`
- `SkeletonText`
- `SkeletonMenu`
- `Table`
- `Tabs`

## Inputs and forms

- `Button`
- `Input`
- `Textarea`
- `Label`
- `Checkbox`
- `Switch`
- `Select`
- `Progress`

## Feedback and overlays

- `Alert`
- `Badge`
- `Dialog`
- `DropdownMenu`
- `Popover`
- `Tooltip`
- `Toaster`

## Commanding and navigation helpers

- `Command`

## Utility exports

- `cn` from `utils`

## Notes

- Most components follow shadcn/ui structure and naming.
- Components are intentionally low-level to support app-specific wrappers.
- Use `className` and prop overrides before changing shared defaults.
- Menu components expose additional customization surfaces through slot-level class maps on content components (for example `SelectContent`/`DropdownMenuContent`).

## Planned next additions

The following composites are planned and should remain domain-neutral:

- `PageWrapper`: responsive page container with optional header/rail slots.
- `Hero`: title, subtitle, action row, and optional media/aside region.

Both should expose root and slot-level overrides (`className`, `classNames`, `slotProps`) and support light/dark token theming without requiring Tailwind or daisyUI.
