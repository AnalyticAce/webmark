export const START = "// webmark:start — added by `npx webmark init`";
export const END = "// webmark:end";

export const clientFile = `${START}
if (process.env.NODE_ENV === "development") {
  import("@dshalom/webmark/client").then(({ webmark }) => webmark());
}
${END}
`;

export const serverFile = `${START}
export async function register() {
  if (process.env.NODE_ENV === "development" && process.env.NEXT_RUNTIME === "nodejs") {
    const { start } = await import("@dshalom/webmark/server");
    await start();
  }
}
${END}
`;

export const MD_START = "<!-- webmark:start -->";
export const MD_END = "<!-- webmark:end -->";

export const agentsBlock = `${MD_START}
## Review comments (webmark)

When I ask you to pick up a review, read \`.webmark/comments.json\`. Each entry is a comment I
left on the running app, with the route it was made on, the text of the element I pointed at,
the owning component, and sometimes a \`source\` file:line.

To find the code a comment is about, in this order:

1. **Route → file.** \`/\` is \`app/page.tsx\`, \`/pricing\` is \`app/pricing/page.tsx\`.
2. **Component → definition.** Grep for \`function <component>\` or \`const <component>\`.
3. **Element text → line.** Grep the literal string in \`anchor.label\`. This is usually decisive.
4. **\`anchor.source\`, when present**, is a hint to verify — open it and confirm the expected
   text is really there before editing. Never edit blind at a stored line number.

Then make the change and mark the comment resolved:

\`\`\`bash
npx webmark resolve <id> --note "what you changed"
\`\`\`

Stop and ask instead of guessing when: the text has no match in the repo (it probably comes from
data), several matches are equally plausible, or the comment is feedback rather than an
instruction. At the end, report what you addressed and what you could not locate.

Never edit \`.webmark/comments.json\` by hand — use \`npx webmark list\` and \`npx webmark resolve\`.
${MD_END}
`;
