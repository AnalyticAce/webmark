# webmark

[![npm](https://img.shields.io/npm/v/@dshalom/webmark)](https://www.npmjs.com/package/@dshalom/webmark)
[![license](https://img.shields.io/npm/l/@dshalom/webmark)](LICENSE)

**Point at what's wrong on the page. Your coding agent picks it up and fixes it.**

Your agent builds a page. You open it, click the headline, and type *"this promise is vague."*
The comment lands in a file your agent reads, with the route, the component, and the exact text
you pointed at. It makes the change, and the pin disappears on its own.

No account, no hosted service, nothing leaves your machine. It runs in development only and
cannot reach a production build.

---

## Install

Requires **Next.js 15.3+** (App Router) and **Node 20+**.

```bash
npm i -D @dshalom/webmark && npx webmark init
```

Restart your dev server. A dark pill appears in the bottom-right corner.

`init` prints every file it touches — two small instrumentation files, one line in
`.gitignore`, and a section in `AGENTS.md` telling your agent how to use the comments.

## Leave a comment

| Key | What it does |
| --- | --- |
| `T` | Pick an element — the page dims, hover to highlight, click to attach |
| `C` | Write a note with no anchor |
| `⌥` + scroll | While picking, widen or narrow the selection |
| `⌘` + `↵` | Save |
| `Esc` | Back out one step |

Everything is also clickable: the pill has buttons for both, and the panel lists what you've
written so far.

Each anchored comment gets a numbered pin on the element's corner. **Hover a pin** to read the
note, edit it, or delete it. Hover a row in the panel and the element lights up on the page.

## Hand it to your agent

Click **Copy for agent** in the panel and paste into Claude Code, Cursor, Aider — anything that
can read a file. Or just say *"pick up the review."* `init` already wrote the instructions into
your `AGENTS.md`.

Your agent reads `.webmark/comments.json`, which gives it enough to find the code without
guessing:

```
### c_xeogb96781
Tighten this to one sentence.

- route: /
- element: <h3> "A human reviews"
- component: CardContent < Card < Home
- selector: div:nth-of-type(1) > div:nth-of-type(2) > div > h3
```

The route narrows it to a file, the component chain names what rendered it, and the quoted text
is usually a single grep away. When it's done, it marks the comment addressed:

```bash
npx webmark resolve c_xeogb96781 --note "shortened to one sentence"
```

## How comments live and die

A comment survives a reload only while it is **unresolved** and the thing it points at **still
renders with the same text**.

Change the copy, delete the component, move it to another page — the comment goes with it. So
when your agent addresses your feedback, the pins clean themselves up while you watch. Nothing
to tick off, no stale annotations piling up.

Resolved comments appear once as an **"addressed"** strip with your agent's notes, then drop.

## Commands

| Command | What it does |
| --- | --- |
| `npx webmark init` | Wires the widget into a Next.js app |
| `npx webmark list [--all] [--json]` | Prints open comments |
| `npx webmark resolve <id> --note "…"` | Marks one addressed |
| `npx webmark eject` | Removes every trace of it |

## Uninstall

```bash
npx webmark eject && npm rm -D @dshalom/webmark
```

`eject` reverses `init` exactly: instrumentation files removed, `.gitignore` and `AGENTS.md`
restored, `.webmark/` deleted. The diff is empty, because the widget never lived in your
component tree.

## Is it safe to leave installed?

- **Development only.** Both the widget and its comment store are behind
  `NODE_ENV === "development"`, so neither exists in a production build. CI enforces this on
  every commit.
- **Local only.** The store binds to `127.0.0.1`, accepts requests from localhost pages only,
  and writes to exactly one gitignored file inside your project.
- **Out of your way.** The widget mounts in a shadow root with its own overlay, so it can't
  inherit your styles, re-render with your app, or intercept a click meant for your page.

---

## This repo

| Path | What it is |
| --- | --- |
| [`packages/webmark`](packages/webmark) | The published package |
| `src/` | A small Next.js page used as the fixture to develop and test it against |

```bash
npm install && npm run dev
```

Contributing, the release process, and CI are documented in
[CONTRIBUTING.md](CONTRIBUTING.md).
