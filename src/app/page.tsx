import CopyCommand from "@/components/copy-command";
import WebmarkDemo from "@/components/webmark-demo";

const steps = [
  {
    title: "Point",
    body: "Press T and click anything on your running app — a heading, a button, a field. The element lights up and a numbered pin sticks to its corner.",
  },
  {
    title: "Say what's wrong",
    body: "Type the note the way you'd say it out loud. “This promise is vague.” “Make this field optional.” No ticket, no template.",
  },
  {
    title: "Hand it over",
    body: "Your agent reads the file, finds the code from the route, the component and the text you pointed at, makes the change, and marks it done.",
  },
];

const guarantees = [
  {
    title: "Development only",
    body: "The widget and its store both sit behind NODE_ENV === \"development\". Neither exists in a production build, and CI fails the commit if the widget so much as appears in the bundle.",
  },
  {
    title: "Local only",
    body: "The store binds to 127.0.0.1, accepts requests from localhost pages only, and writes one gitignored file inside your project. No account, no telemetry, no service.",
  },
  {
    title: "Out of your way",
    body: "It mounts in a shadow root with its own overlay, so it cannot inherit your styles, re-render with your app, or swallow a click meant for your page.",
  },
];

export default function Home() {
  return (
    <>
      <WebmarkDemo />

      <header className="sticky top-0 z-40 border-b border-rule-soft bg-ink/80 backdrop-blur-md">
        <nav
          className="mx-auto flex h-14 max-w-[1180px] items-center gap-6 px-6"
          aria-label="Main"
        >
          <span className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
            <span aria-hidden className="size-2.5 rounded-[3px] bg-acid" />
            webmark
          </span>
          <span className="hidden text-[12px] text-paper-faint sm:inline">
            local review for agent-built UI
          </span>
          <a
            href="https://github.com/AnalyticAce/webmark"
            className="ml-auto flex items-center gap-1.5 text-[13px] text-paper-dim transition-colors duration-150 hover:text-acid"
          >
            <svg aria-hidden viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@dshalom/webmark"
            className="flex items-center gap-1.5 text-[13px] text-paper-dim transition-colors duration-150 hover:text-acid"
          >
            <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            npm
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* ---------------------------------------------------------------- hero */}
        <section className="mx-auto max-w-[1180px] px-6 pt-24 pb-20 md:pt-36">
          <p className="eyebrow rise text-center">Dev only · Local only · No account</p>

          <h1 className="rise mt-7 mx-auto max-w-[16ch] font-display text-[clamp(3.25rem,9vw,6.75rem)] leading-[0.92] tracking-[-0.02em] text-balance text-center [animation-delay:80ms]">
            Point at what&apos;s wrong.{" "}
            <em className="text-acid italic">Your agent fixes it.</em>
          </h1>

          <p className="rise mt-8 mx-auto max-w-[54ch] text-center text-[17px] leading-[1.7] text-paper-dim [animation-delay:160ms]">
            Your agent builds a page. You open it, click the headline, and type
            <span className="text-paper"> “this promise is vague.”</span> The comment lands in a
            file your agent reads — with the route, the component and the exact text you pointed
            at. It makes the change, and the pin disappears on its own.
          </p>

          <div className="rise mt-11 flex flex-col items-center gap-4 [animation-delay:240ms]">
            <CopyCommand command="npm i -D @dshalom/webmark && npx webmark init" />
            <a
              href="#how"
              className="text-[14px] text-paper-dim underline decoration-rule underline-offset-[6px] transition-colors duration-150 hover:text-acid hover:decoration-acid-deep"
            >
              See how it works
            </a>
          </div>

        </section>

        {/* ------------------------------------------------------------ the shot */}
        <section className="mx-auto max-w-[1180px] px-6 pb-28">
          <ProductShot />
        </section>

        {/* The page is the demo — say so, below the shot. */}
        <aside className="mx-auto max-w-[1180px] px-6 pb-16 flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-acid-deep py-1 pl-5 text-[14px] text-paper-dim">
          <strong className="font-medium text-paper">This page is the demo.</strong>
          <span>
            The real widget is running bottom-right. Press
            <Key>T</Key> and click anything, or
            <Key>C</Key> for a note with no anchor.
          </span>
          <span className="text-paper-faint">
            Comments stay in this browser — nothing is sent anywhere.
          </span>
        </aside>

        {/* ------------------------------------------------------------ how it works */}
        <section id="how" className="border-y border-rule-soft bg-ink-2/60">
          <div className="mx-auto max-w-[1180px] px-6 py-24">
            <p className="eyebrow">The loop</p>
            <h2 className="mt-5 max-w-[18ch] font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.02em]">
              Three moves, then it&apos;s the agent&apos;s problem.
            </h2>

            <ol className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="border-t border-rule pt-6">
                  <span className="flex size-6 items-center justify-center rounded-[7px_7px_7px_2px] bg-acid text-[12px] font-semibold text-on-acid tabular-nums">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-[26px] leading-tight tracking-[-0.01em]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-paper-dim">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ hand-off */}
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <p className="eyebrow">The hand-off</p>
              <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
                Data, not a protocol.
              </h2>
              <p className="mt-6 text-[15px] leading-[1.7] text-paper-dim">
                Comments are a gitignored JSON file and a short section in your{" "}
                <code className="text-paper">AGENTS.md</code>. Any agent that can read a file can
                pick up a review — Claude Code, Cursor, Aider, whatever you run next year. There is
                no server to register and no MCP to configure.
              </p>
              <p className="mt-5 text-[15px] leading-[1.7] text-paper-dim">
                Say <span className="text-paper">“pick up the review”</span>, or hit{" "}
                <span className="text-paper">Copy for agent</span> in the panel.
              </p>
            </div>

            <Terminal />
          </div>
        </section>

        {/* ------------------------------------------------------------ lifecycle */}
        <section className="border-y border-rule-soft bg-ink-2/60">
          <div className="mx-auto grid max-w-[1180px] gap-14 px-6 py-24 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow">Lifecycle</p>
              <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
                Comments clean up after themselves.
              </h2>
            </div>
            <div className="space-y-6 text-[15px] leading-[1.7] text-paper-dim">
              <p>
                A comment survives a reload only while it is{" "}
                <span className="text-paper">unresolved</span> and the thing it points at{" "}
                <span className="text-paper">still renders the same text</span>.
              </p>
              <p>
                Change the copy, delete the component, move it to another page — the comment goes
                with it. So as your agent works through your feedback, the pins vanish one by one
                while you watch. Nothing to tick off, no stale annotations piling up.
              </p>
              <p>
                Resolved ones surface once as an{" "}
                <span className="text-acid">addressed</span> strip carrying your agent&apos;s
                notes, then drop for good.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ safety */}
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <p className="eyebrow">Is it safe to leave installed?</p>
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {guarantees.map((g) => (
              <div key={g.title} className="border-t border-rule pt-6">
                <h3 className="font-display text-[24px] leading-tight tracking-[-0.01em]">
                  {g.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-paper-dim">{g.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ close */}
        <section className="border-t border-rule-soft">
          <div className="mx-auto max-w-[1180px] px-6 py-28 text-center">
            <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-balance">
              Stop describing the bug. <em className="text-acid italic">Point at it.</em>
            </h2>
            <div className="mt-12 flex justify-center">
              <CopyCommand command="npm i -D @dshalom/webmark && npx webmark init" />
            </div>
            <p className="mt-6 text-[13px] text-paper-faint">
              Requires Next.js 15.3+ (App Router) and Node 20+. Uninstall with{" "}
              <code className="text-paper-dim">npx webmark eject</code> — the diff is empty.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule-soft">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-7 gap-y-3 px-6 py-9 text-[13px] text-paper-faint">
          <span className="flex items-center gap-2 text-paper-dim">
            <span aria-hidden className="size-2 rounded-[2px] bg-acid" />
            webmark
          </span>
          <a
            href="https://github.com/AnalyticAce/webmark"
            className="transition-colors duration-150 hover:text-acid"
          >
            Source
          </a>
          <a
            href="https://www.npmjs.com/package/@dshalom/webmark"
            className="transition-colors duration-150 hover:text-acid"
          >
            Package
          </a>
          <a
            href="https://github.com/AnalyticAce/webmark/blob/main/CONTRIBUTING.md"
            className="transition-colors duration-150 hover:text-acid"
          >
            Contributing
          </a>
          <span className="ml-auto">MIT</span>
        </div>
      </footer>
    </>
  );
}

/* ------------------------------------------------------------------ pieces */

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-1.5 inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[5px] border border-rule bg-surface px-1.5 text-[11px] font-medium text-paper">
      {children}
    </kbd>
  );
}

/**
 * The product shot, built in markup rather than shipped as a screenshot — it stays sharp at any
 * size, reads to a screen reader, and cannot drift out of date the way an image does.
 */
function ProductShot() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-rule bg-ink-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 border-b border-rule-soft px-5 py-3.5">
        <span aria-hidden className="size-2.5 rounded-full bg-rule" />
        <span aria-hidden className="size-2.5 rounded-full bg-rule" />
        <span aria-hidden className="size-2.5 rounded-full bg-rule" />
        <span className="ml-3 text-[12px] text-paper-faint">localhost:3000</span>
      </div>

      <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* the app being reviewed */}
        <div className="space-y-5">
          <Pinned n={1}>
            <h3 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight tracking-[-0.02em]">
              The only checkout that pays for itself
            </h3>
          </Pinned>

          <p className="max-w-[52ch] text-[15px] leading-[1.7] text-paper-dim">
            Drop in three lines and start collecting payments in minutes. Trusted by teams who
            care about conversion.
          </p>

          <Pinned n={2}>
            <span className="inline-flex h-11 items-center rounded-lg bg-acid px-5 text-[14px] font-semibold text-on-acid">
              Get started free
            </span>
          </Pinned>
        </div>

        {/* widget panel — exact markup and CSS from widget.js / styles.js */}
        <aside className="wm-snap self-start">
          <style>{`
            .wm-snap {
              --accent:#c4d600; --on-accent:#0f0f0d;
              --panel-bg:#1c1c18; --panel-border:#3a3a34; --panel-elev:#26261f;
              --hairline:#26261f; --muted:#a8a89e; --faint:#8f8f84; --bar-fg:#e8e8e2;
              --chip-bg:#26261f; --chip-text:#a8a89e; --accent-tint:#2c3010;
              --shadow:0 12px 36px rgba(0,0,0,.55);
              --ease:cubic-bezier(.2,.9,.3,1);
              font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
              -webkit-font-smoothing:antialiased;
              color:var(--bar-fg);
              width:min(360px,100%); display:flex; flex-direction:column; overflow:hidden;
              border-radius:16px; background:var(--panel-bg); border:1px solid var(--panel-border);
              box-shadow:var(--shadow);
            }
            .wm-snap *,.wm-snap *::before,.wm-snap *::after{box-sizing:border-box}
            .wm-snap button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
            .wm-snap .header{display:flex;align-items:center;gap:8px;padding:14px 16px 8px;flex:none}
            .wm-snap .header h2{font-size:14px;font-weight:600;letter-spacing:-.01em}
            .wm-snap .count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 6px;border-radius:999px;font-size:11px;font-weight:700;font-variant-numeric:tabular-nums}
            .wm-snap .count.soft{background:var(--accent-tint);color:var(--accent)}
            .wm-snap .spacer{flex:1}
            .wm-snap .iconbtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;color:var(--faint)}
            .wm-snap ul{list-style:none;padding:0;margin:0}
            .wm-snap .list{border-top:1px solid var(--hairline)}
            .wm-snap .item{padding:12px 16px;border-bottom:1px solid var(--hairline)}
            .wm-snap .item:last-child{border-bottom:0}
            .wm-snap .item-top{display:flex;align-items:flex-start;gap:10px}
            .wm-snap .badge{display:inline-flex;align-items:center;justify-content:center;flex:none;width:22px;height:22px;margin-top:1px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-size:11px;font-weight:700;font-variant-numeric:tabular-nums}
            .wm-snap .item-body{flex:1;min-width:0}
            .wm-snap .item-text{font-size:13.5px;line-height:1.35;word-break:break-word}
            .wm-snap .item-chip{display:inline-block;max-width:100%;margin-top:6px;padding:2px 8px;border-radius:999px;background:var(--chip-bg);color:var(--chip-text);font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom}
            .wm-snap .footer{display:flex;align-items:center;gap:8px;height:44px;padding:0 12px;flex:none;border-top:1px solid var(--hairline);font-size:12.5px}
            .wm-snap .footer button{white-space:nowrap;color:var(--muted);border-radius:999px;height:28px;padding:0 10px}
            .wm-snap .toggle{display:inline-flex;align-items:center;gap:6px}
            .wm-snap .chev{display:inline-flex}
          `}</style>

          <div className="header">
            <h2>Review</h2>
            <span className="count soft">1</span>
            <span className="spacer" />
            <button className="iconbtn" aria-label="Close review panel">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
            </button>
          </div>

          <ul className="list">
            <li className="item">
              <div className="item-top">
                <span className="badge">1</span>
                <div className="item-body">
                  <div className="item-text">This promise is vague — say what it actually does.</div>
                  <span className="item-chip">&lt;h3&gt; &quot;The only checkout…&quot;</span>
                </div>
                <button className="iconbtn" aria-label="Edit note 1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
                <button className="iconbtn" aria-label="Delete note 1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                </button>
              </div>
            </li>
          </ul>

          <div className="footer">
            <button className="toggle">
              <span className="chev">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
              <span>Show 1 comment</span>
            </button>
            <span className="spacer" />
            <button className="toggle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
              <span>Copy</span>
            </button>
            <button>Delete all</button>
          </div>
        </aside>
      </div>
      <figcaption className="sr-only">
        A landing page in the browser with two numbered review pins attached to elements, and the
        note left on the first one shown beside it.
      </figcaption>
    </figure>
  );
}

/** An element wearing a review pin, the way the widget draws it. */
function Pinned({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="relative inline-block max-w-full rounded-[3px] outline-1 outline-offset-[6px] outline-acid-deep">
      {children}
      <span
        aria-hidden
        className="absolute -top-2.5 -right-2.5 flex size-[22px] items-center justify-center rounded-[7px_7px_7px_2px] bg-acid text-[11px] font-semibold text-on-acid tabular-nums"
      >
        {n}
      </span>
    </div>
  );
}

function Terminal() {
  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-ink-2">
      <div className="border-b border-rule-soft px-5 py-3 text-[12px] text-paper-faint">
        npx webmark list
      </div>
      <pre className="overflow-x-auto px-5 py-5 text-[13px] leading-[1.85]">
        <code>
          <span className="text-acid">### c_xeogb96781</span>
          {"\n"}
          <span className="text-paper">Tighten this to one sentence.</span>
          {"\n\n"}
          <span className="text-paper-faint">- route: </span>
          <span className="text-paper-dim">/</span>
          {"\n"}
          <span className="text-paper-faint">- element: </span>
          <span className="text-paper-dim">&lt;h3&gt; &quot;A human reviews&quot;</span>
          {"\n"}
          <span className="text-paper-faint">- component: </span>
          <span className="text-paper-dim">CardContent &lt; Card &lt; Home</span>
          {"\n"}
          <span className="text-paper-faint">- selector: </span>
          <span className="text-paper-dim">body &gt; div:nth-of-type(1) &gt; div &gt; h3</span>
          {"\n\n"}
          <span className="text-paper-faint">
            {"# when it's done\n"}
          </span>
          <span className="text-acid-deep">$ </span>
          <span className="text-paper-dim">
            npx webmark resolve c_xeogb96781 --note &quot;shortened&quot;
          </span>
        </code>
      </pre>
    </div>
  );
}
