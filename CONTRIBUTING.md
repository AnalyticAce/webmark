# Contributing

```bash
npm install && npm run dev
```

`src/` is a small Next.js page used purely as a fixture — it gives the widget a real page to
anchor comments against (a sticky nav, headings, repeated sibling cards). The package itself is
[`packages/webmark`](packages/webmark), linked into the app with `file:`, so edits to it show up
in the running app after a dev-server restart.

The package ships plain ESM with **no build step**. What you write is what publishes.

## Checks

CI runs exactly these, and so should you before pushing:

```bash
find packages/webmark/src -name '*.js' -print0 | xargs -0 -n1 node --check  # the "build"
npm run typecheck   # runs `next typegen` first — generated types don't exist in a fresh clone
npm run lint
npx next build      # exercises the real install path
```

Plus a guard that fails the build if `webmark-root` appears in `.next/static` — the widget must
never reach a production bundle.

Verify from a **clean tree**, not your warm working directory. Most "works locally" failures come
from state you already have:

```bash
rm -rf .next node_modules && npm ci
```

## Releasing

[semantic-release](https://semantic-release.gitbook.io/) owns versioning, tagging, the changelog,
the GitHub release, and the npm publish. Never edit a version number or write a tag by hand —
`packages/webmark/package.json` says `0.0.0-development` on purpose, because the git tags are the
source of truth.

| Commit on `main` | Result |
| --- | --- |
| `feat: …` | minor |
| `fix: …`, `perf: …` | patch |
| `feat!: …` or a `BREAKING CHANGE:` footer | major |
| `docs`, `chore`, `ci`, `test`, `refactor`, `style` | no release |

Push to `main`, CI verifies, then semantic-release bumps the manifest, writes
`packages/webmark/CHANGELOG.md`, commits both as `chore(release): X.Y.Z [skip ci]`, tags it,
publishes to npm, and opens a GitHub release. Config lives in [`.releaserc.json`](.releaserc.json).

Preview what the next push would ship — no guessing:

```bash
GITHUB_TOKEN=$(gh auth token) npx semantic-release --dry-run --no-ci
```

**Every releasable commit on `main` ships a version**, including one that only touches the
fixture app — semantic-release has no path filter. Keep non-package work under `chore:` /
`docs:` / `refactor:`.

### Publishing credentials

CI publishes through **npm trusted publishing**: GitHub Actions mints an OIDC token, npm
exchanges it for a short-lived publish token, and nothing long-lived lives in the repo. It also
works with 2FA set to *auth-and-writes*, which no static token can satisfy.

It's already configured. If you ever set it up again from scratch, the order matters:

1. Publish once by hand — the OIDC exchange endpoint is package-scoped, so the package must
   exist before a trusted publisher can be attached to it.
2. On npmjs.com → the package → Settings → Trusted Publisher → GitHub Actions, pointing at this
   repository and `ci.yml`.
3. Grant `id-token: write` to the release job, and delete any `NPM_TOKEN` secret once a release
   has gone through on OIDC.

### If a release fails partway

semantic-release commits and tags **before** it publishes, so a failed upload leaves a tag
claiming a version that npm doesn't have. Recovery is always the same: delete the tag, fix the
cause, push again.

```bash
git push --delete origin vX.Y.Z
```
