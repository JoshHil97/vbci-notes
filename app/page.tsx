export default function HomePage() {
  return (
    <main className="py-14">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 p-12 shadow-sm backdrop-blur">
        {/* Purple glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-600/35 blur-3xl" />

        {/* Gold glow */}
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-amber-400/25 blur-3xl" />

        <div className="relative space-y-6">
          <p className="inline-flex w-fit items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
            Habakkuk 2:2
          </p>

          <blockquote className="max-w-3xl text-2xl font-medium leading-snug tracking-tight text-neutral-900 md:text-3xl">
            “Write the vision and make it plain,
            <br />
            that he may run who reads it.”
          </blockquote>

          <div className="pt-2 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              VBCI Notes
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-neutral-700">
              A dedicated space for weekly sermon notes, written clearly and preserved
              so the church family can revisit, reflect, and grow in the Word.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <a
              href="/notes"
              className="inline-flex items-center justify-center rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
            >
              Read weekly notes
            </a>

            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-300"
            >
              About this page
            </a>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Written clearly",
            desc: "Notes are structured so the message is easy to follow and remember.",
          },
          {
            title: "Summarised faithfully",
            desc: "Automatic bullet summaries help reinforce the core message.",
          },
          {
            title: "Kept for the church",
            desc: "A growing archive of teachings for reflection and study.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm backdrop-blur"
          >
            <div className="text-lg font-semibold text-neutral-950">
              {card.title}
            </div>
            <div className="mt-2 text-sm text-neutral-700">
              {card.desc}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
