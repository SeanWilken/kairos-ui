# 06 - Release and Publishing (alpha)

This project is currently released in alpha while integrations are refined.

## Release sequence

1. Push changes to GitHub
2. Ensure CI passes (`typecheck` and `build`)
3. Publish alpha tag to npm
4. Consume from app repos with normal package install

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
bun add @kairos/ui@alpha
```

## Before publishing

- Update `CHANGELOG.md`
- Verify package files (`npm pack`)
- Verify install in `studio` and `core` frontend surfaces
