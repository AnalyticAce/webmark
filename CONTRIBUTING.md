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

[semantic-release](https://semantic-release.gitbook.io/) owns versioning, tagging, release notes,
and the GitHub release. Never edit a version number or write a tag by hand —
`packages/webmark/package.json` says `0.0.0-development` on purpose, because the git tags are the
source of truth.

| Commit on `main` | Result |
| --- | --- |
| `feat: …` | minor |
| `fix: …`, `perf: …` | patch |
| `feat!: …` or a `BREAKING CHANGE:` footer | major |
| `docs`, `chore`, `ci`, `test`, `refactor`, `style` | no release |

Push to `main`, CI verifies, then semantic-release stamps the version into the packed manifest,
tags it, opens a GitHub release with the notes, and attaches the tarball to it as `webmark.tgz`.
It never commits back: `main` requires signed commits through pull requests, which a bot push
cannot satisfy, so release notes live on GitHub Releases and `CHANGELOG.md` stops at 1.7.1. Nothing is
published to npm — users install straight from the release URL. Config lives in [`.releaserc.json`](.releaserc.json).

Preview what the next push would ship — no guessing:

```bash
GITHUB_TOKEN=$(gh auth token) npx semantic-release --dry-run --no-ci
```

**Every releasable commit on `main` ships a version**, including one that only touches the
fixture app — semantic-release has no path filter. Keep non-package work under `chore:` /
`docs:` / `refactor:`.

### Publishing credentials

None beyond the workflow's own `GITHUB_TOKEN` (`contents: write` on the release job). The repo
must stay public: `releases/latest/download/webmark.tgz` is fetched by `npm` without auth.

### If a release fails partway

semantic-release tags **before** it uploads, so a failed upload leaves a tag (or a
release with no `webmark.tgz`) claiming a version nobody can install. Recovery is always the same: delete the tag, fix the
cause, push again.

```bash
git push --delete origin vX.Y.Z
```
