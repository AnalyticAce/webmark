<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- webmark:start -->
## Review comments (webmark)

When I ask you to pick up a review, read `.webmark/comments.json`. Each entry is a comment I
left on the running app, with the route it was made on, the text of the element I pointed at,
the owning component, and sometimes a `source` file:line.

To find the code a comment is about, in this order:

1. **Route → file.** `/` is `app/page.tsx`, `/pricing` is `app/pricing/page.tsx`.
2. **Component → definition.** Grep for `function <component>` or `const <component>`.
3. **Element text → line.** Grep the literal string in `anchor.label`. This is usually decisive.
4. **`anchor.source`, when present**, is a hint to verify — open it and confirm the expected
   text is really there before editing. Never edit blind at a stored line number.

Then make the change and mark the comment resolved:

```bash
npx webmark resolve <id> --note "what you changed"
```

Stop and ask instead of guessing when: the text has no match in the repo (it probably comes from
data), several matches are equally plausible, or the comment is feedback rather than an
instruction. At the end, report what you addressed and what you could not locate.

Never edit `.webmark/comments.json` by hand — use `npx webmark list` and `npx webmark resolve`.
<!-- webmark:end -->
