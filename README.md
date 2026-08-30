# webmark

Point-and-comment review layer for the page your coding agent just built. You review in the
browser; your agent picks the comments up from a file and makes the changes.

Solo and local by design: no account, no hosted service, nothing leaves your machine.

## Layout

| Path | What it is |
| --- | --- |
| [`packages/webmark`](packages/webmark) | The tool itself — dev-only widget, local comment store, CLI |
| `src/` | A bare Next.js page used as the fixture to build and test it against |

## Try it

```bash
npm install && npm run dev
```

Open http://localhost:3000. Press `T` to pick an element, `C` for a general note. Then:

```bash
npx webmark list
```

## Installing it in another project

```bash
npm i -D @dshalom/webmark && npx webmark init
```

See [the package README](packages/webmark/README.md) for the full command set, the rules that
decide when a comment survives a reload, and how it stays out of production builds.

## Releasing

[semantic-release](https://semantic-release.gitbook.io/) owns versioning, tagging, the changelog,
the GitHub release, and the npm publish. You never edit a version number or write a tag.

| Commit on `main` | Result |
| --- | --- |
| `feat: …` | minor |
| `fix: …`, `perf: …` | patch |
| `feat!: …` or a `BREAKING CHANGE:` footer | major |
| `docs`, `chore`, `ci`, `test`, `refactor`, `style` | no release |

Push to `main`, CI verifies, then semantic-release analyses the commits, bumps
`packages/webmark/package.json`, writes `packages/webmark/CHANGELOG.md`, commits both as
`chore(release): X.Y.Z [skip ci]`, tags it, publishes to npm, and opens a GitHub release with
generated notes. Configuration lives in [`.releaserc.json`](.releaserc.json).

**Every releasable commit on `main` ships a version**, including one that only touches the demo
app — semantic-release has no path filter. Keep non-package work under `chore:` / `docs:` /
`refactor:`, or add `semantic-release-monorepo` if that becomes a nuisance.

Preview what the next push would release:

```bash
npx semantic-release --dry-run --no-ci
```

### Publishing credentials

CI publishes through **npm trusted publishing** — GitHub Actions mints an OIDC token, npm
exchanges it for a short-lived publish token, and nothing long-lived is stored in the repo. It
also works with 2FA set to *auth-and-writes*, which no static token can satisfy.

Setting it up, once:

1. The package must exist on npm first, so publish the initial version by hand (this is the
   only time you enter an OTP): `cd packages/webmark && npm publish --access public`
2. On npmjs.com → the package → Settings → Trusted Publisher → GitHub Actions, with repository
   `AnalyticAce/webmark` and workflow `ci.yml`.
3. Once one release has gone through on OIDC, delete the `NPM_TOKEN` secret.
   `@semantic-release/npm` tries OIDC first and only falls back to a token, so it is dead
   weight — and a long-lived publish token in repo secrets is what 2FA exists to prevent.

Every push and pull request runs the same verification the release does: syntax check, types,
lint, a production build of the demo app, a guard that the widget never reaches that bundle, and
a dry-run pack.
