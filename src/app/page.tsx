import SiteHeader from "@/components/site-header";

const steps = [
  {
    title: "The agent submits",
    body: "Your agent posts the plan to webmark instead of your terminal, and you get a link.",
  },
  {
    title: "A human reviews",
    body: "Highlight anything and comment on it. Then approve, or ask for changes.",
  },
  {
    title: "The agent revises",
    body: "Your agent picks up the comments and posts a new version, with your notes still on the passages they were about.",
  },
];

const features = [
  {
    title: "Anchored comments",
    body: "Comments attach to the passage itself, so a revision carries each one along with the text it belongs to.",
  },
  {
    title: "Suggest and strike",
    body: "Reword a sentence with before/after, or strike a passage in one keystroke. Faster than typing it out.",
  },
  {
    title: "Versions and diffs",
    body: "Every revision is a version. Compare any two, and reach the discussion an earlier one carried.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <section className="bg-band">
        <div className="mx-auto max-w-[1400px] px-6 py-20 text-center">
          <h1 className="dc-heading text-balance text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.05] font-bold text-white">
            Try it on this page.
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-[19px] leading-relaxed text-band-ink">
            Select any piece of text and leave a comment — the headline, the footer, this very
            sentence, all fair game. Nothing is saved and nobody&apos;s feelings are involved.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-24 text-text">
        <h2 className="dc-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold">
          From raw to reviewed.
        </h2>

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {steps.map((s, i) => (
            <article key={s.title} className="rounded-2xl bg-surface-3 px-8 py-8">
              <span className="flex size-7 items-center justify-center rounded-full bg-band text-[13px] font-semibold text-accent tabular-nums">
                {i + 1}
              </span>
              <h3 className="dc-heading mt-7 text-[26px] font-bold">{s.title}</h3>
              <p className="mt-4 text-[17px] leading-[1.6] text-text-mute">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-24 grid gap-7 md:grid-cols-3">
          {features.map((f) => (
            <section key={f.title} className="px-2">
              <h3 className="dc-heading text-[22px] font-bold">{f.title}</h3>
              <p className="mt-3 text-[17px] leading-[1.6] text-text-mute">{f.body}</p>
            </section>
          ))}
        </div>
      </main>

    </>
  );
}
