# 06 - Release and Publishing (alpha)

This project is currently released in alpha while integrations are refined.

Package name and scope: `@kairosstack/ui` under npm organization `@kairosstack`.

## Release sequence

1. Push changes to GitHub
2. Ensure CI passes (`typecheck` and `build`)
3. Validate UI changes in Storybook (`bun run storybook` or `bun run build-storybook`)
4. Publish alpha tag to npm
5. Consume from app repos with normal package install

## Versioning

Use semver prerelease tags, for example:

- `0.1.0-alpha.1`
- `0.1.0-alpha.2`

## Publish command example

```bash
npm publish --tag alpha --access public
```

## Consumer install (alpha)

```bash
bun add @kairosstack/ui@alpha
```

## Before publishing

- Update `CHANGELOG.md`
- Verify package files (`npm pack`)
- Manually verify affected components in Storybook
- Verify install in `studio` and `core` frontend surfaces

## GitHub Pages Storybook

Interactive docs can be deployed automatically with `.github/workflows/storybook-pages.yml`.

- Enable GitHub Pages in repository settings and set source to **GitHub Actions**.
- On each push to `main`, Storybook builds and deploys as a static site.
