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
            className="ml-auto text-[13px] text-paper-dim transition-colors duration-150 hover:text-acid"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@dshalom/webmark"
            className="text-[13px] text-paper-dim transition-colors duration-150 hover:text-acid"
          >
            npm
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* ---------------------------------------------------------------- hero */}
        <section className="mx-auto max-w-[1180px] px-6 pt-24 pb-20 md:pt-36">
          <p className="eyebrow rise">Dev only · Local only · No account</p>

          <h1 className="rise mt-7 max-w-[16ch] font-display text-[clamp(3.25rem,9vw,6.75rem)] leading-[0.92] tracking-[-0.02em] text-balance [animation-delay:80ms]">
            Point at what&apos;s wrong.{" "}
            <em className="text-acid italic">Your agent fixes it.</em>
          </h1>

          <p className="rise mt-8 max-w-[54ch] text-[17px] leading-[1.7] text-paper-dim [animation-delay:160ms]">
            Your agent builds a page. You open it, click the headline, and type
            <span className="text-paper"> “this promise is vague.”</span> The comment lands in a
            file your agent reads — with the route, the component and the exact text you pointed
            at. It makes the change, and the pin disappears on its own.
          </p>

          <div className="rise mt-11 flex flex-col items-start gap-4 sm:flex-row sm:items-center [animation-delay:240ms]">
            <CopyCommand command="npm i -D @dshalom/webmark && npx webmark init" />
            <a
              href="#how"
              className="text-[14px] text-paper-dim underline decoration-rule underline-offset-[6px] transition-colors duration-150 hover:text-acid hover:decoration-acid-deep"
            >
              See how it works
            </a>
          </div>

          {/* The page is the demo — say so, next to the thing itself. */}
          <aside className="rise mt-16 flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-acid-deep py-1 pl-5 text-[14px] text-paper-dim [animation-delay:320ms]">
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
        </section>

        {/* ------------------------------------------------------------ the shot */}
        <section className="mx-auto max-w-[1180px] px-6 pb-28">
          <ProductShot />
        </section>

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

      <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_300px]">
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

        {/* the note the reviewer left */}
        <aside className="self-start rounded-xl border border-rule bg-surface p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-[22px] items-center justify-center rounded-[7px_7px_7px_2px] bg-acid text-[11px] font-semibold text-on-acid tabular-nums">
              1
            </span>
            <span className="text-[12px] text-paper-faint">on &lt;h3&gt;</span>
          </div>
          <p className="mt-3.5 text-[14px] leading-[1.6] text-paper">
            This promise is vague — say what it actually does.
          </p>
          <div className="mt-4 flex items-center gap-2 border-t border-rule-soft pt-3.5 text-[11px] text-paper-faint">
            <span className="truncate">Hero &lt; LandingPage</span>
            <span className="ml-auto shrink-0 text-acid-deep">unresolved</span>
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
