# webmark

Point-and-comment review layer for the page your coding agent just built. Dev-only, local-only,
no account, no server to run.

```bash
npm i -D @dshalom/webmark && npx webmark init
```

Restart the dev server. A pill appears bottom-right — press `C` for a note, `T` to pick an
element on the page. Comments land in `.webmark/comments.json` (gitignored).

When you're ready, hit **Copy for agent** and paste into your coding agent. `npx webmark init`
also writes the instructions your agent needs into `AGENTS.md`.

## Commands

| Command | What it does |
| --- | --- |
| `npx webmark init` | Adds `instrumentation-client` + `instrumentation` blocks, gitignores `.webmark/`, writes the `AGENTS.md` section |
| `npx webmark eject` | Reverses all of it, deletes `.webmark/` |
| `npx webmark list [--all] [--json]` | Prints open comments |
| `npx webmark resolve <id> --note "…"` | Marks one addressed |

## How comments live and die

A comment survives a reload only while it is **unresolved** and the thing it points at **still
renders with the same text**. Change the copy, delete the component, move it to another page, and
the comment goes with it. So when your agent addresses feedback, the pins clean themselves up.

Resolved comments surface once as an "addressed" strip on the next load, then drop.

## Safety

The widget and its comment store are `NODE_ENV === "development"` only — neither reaches a
production bundle. The store binds to `127.0.0.1`, accepts only localhost origins, and writes to
exactly one file inside your project.
