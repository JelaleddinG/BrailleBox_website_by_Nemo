import Image from "next/image";

const audienceCards = [
  {
    title: "For TVIs",
    body:
      "See student progress without chasing spreadsheets. BrailleBox gives Teachers of the Visually Impaired a clearer, faster way to track learning and adapt instruction.",
  },
  {
    title: "For school districts",
    body:
      "Support Braille instruction with measurable progress, better reporting, and a stronger information loop between students, teachers, and schools.",
  },
  {
    title: "For families and advocates",
    body:
      "Follow a mission that aims to make Braille literacy more accessible, more measurable, and more respected inside modern education systems.",
  },
];

const productPillars = [
  {
    title: "Interactive Braille learning device",
    body:
      "A tactile hardware experience designed to help visually impaired students practice Braille with immediate feedback and repeated engagement.",
  },
  {
    title: "Teacher-facing progress visibility",
    body:
      "A connected dashboard that helps educators understand what students are practicing, where they improve, and where support is needed next.",
  },
  {
    title: "A stronger information loop",
    body:
      "BrailleBox is built around the full loop from student interaction to teacher insight, helping schools move beyond static tools and manual tracking.",
  },
];

const seoTopics = [
  "Braille learning tool",
  "Assistive technology for visually impaired students",
  "Braille education for schools",
  "Teacher workflow and progress tracking",
  "Accessible literacy and classroom outcomes",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,#1b2440_0%,#0a1020_45%,#05070d_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_35%,transparent)]" />
        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Piloting with real educator feedback, including Sherlock Center
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Braille education,
              <br />
              rethought for the modern classroom.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              BrailleBox is a hardware and software system that helps visually
              impaired students learn Braille while giving teachers and schools a
              clearer view of progress, feedback, and instructional impact.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#community"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-white/90"
              >
                Join Our Community
              </a>
              <a
                href="#product"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore the product
              </a>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              <div>
                <div className="text-3xl font-semibold text-white">Hardware</div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Tactile learning designed around Braille instruction.
                </p>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">Software</div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Teacher insight, progress visibility, and better decision-making.
                </p>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">Mission</div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Accessible literacy with higher standards, not lower expectations.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center lg:justify-end">
            <div className="hero-device-shell w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-6">
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-6 sm:p-8">
                <Image
                  src="/assets/device.jpg"
                  alt="BrailleBox learning device"
                  width={1400}
                  height={1100}
                  priority
                  className="h-auto w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {audienceCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-4 text-sm uppercase tracking-[0.22em] text-slate-500">
                Audience
              </div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {card.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="border-y border-black/6 bg-[#f5f7fb]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Our Product
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Built to feel premium. Built to do real work.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              BrailleBox is not just a Braille device. It is a connected learning
              system designed to support Braille instruction, surface progress,
              and give educators a stronger signal on what is actually happening
              between sessions.
            </p>
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <Image
                src="/assets/device.jpg"
                alt="BrailleBox product photo"
                width={1400}
                height={1000}
                className="h-auto w-full rounded-[1.5rem] object-cover"
              />
            </div>
            <div className="grid gap-5">
              {productPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
                >
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Why it matters
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Better Braille literacy needs better systems.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Teachers of the Visually Impaired are asked to do high-impact work
            with limited time, fragmented tools, and too much manual tracking.
            BrailleBox exists to make instruction more visible, more responsive,
            and more sustainable.
          </p>
          <div className="mt-10 grid gap-4 text-base leading-7 text-slate-600 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/8 bg-white p-6">
              Progress should not depend on guesswork.
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white p-6">
              Assistive technology should help teachers, not add admin burden.
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white p-6">
              Modern schools need better visibility into Braille learning.
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white p-6">
              Accessible literacy deserves product quality equal to any premium tech.
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-black/8 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.18)] sm:p-8">
          <div className="mb-5 text-sm uppercase tracking-[0.24em] text-white/55">
            Search relevance we are building for
          </div>
          <ul className="space-y-4">
            {seoTopics.map((topic) => (
              <li
                key={topic}
                className="rounded-[1.25rem] border border-white/10 bg-white/5 px-5 py-4 text-base text-white/82"
              >
                {topic}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-7 text-white/60">
            This site is being rebuilt with a premium product narrative and a
            clearer foundation for SEO around Braille education, assistive
            technology, visually impaired students, and school adoption.
          </p>
        </div>
      </section>

      <section className="border-y border-black/6 bg-[#f7f8fa]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.95fr_1.05fr] lg:px-10">
          <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <Image
              src="/assets/dashboard.webp"
              alt="BrailleBox dashboard preview"
              width={1400}
              height={1000}
              className="h-auto w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Connected insight
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              From student interaction to teacher understanding.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              The long-term vision behind BrailleBox is simple: create a better
              feedback loop between student practice and teacher action. Less
              friction. More visibility. Better instruction.
            </p>
            <div className="mt-8 space-y-4 text-base leading-7 text-slate-600">
              <p>
                • A tactile experience for students.
              </p>
              <p>
                • A clearer dashboard for educators.
              </p>
              <p>
                • A stronger foundation for measurable progress over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_.85fr] lg:items-end">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Mission
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              We are building for a world where Braille literacy is treated like it matters.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              BrailleBox is mission-driven by design. The goal is not to add more
              noise to classrooms. The goal is to help educators, schools, and
              families deliver better Braille learning with tools that feel worthy
              of the students using them.
            </p>
          </div>
          <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <Image
              src="/assets/team.png"
              alt="BrailleBox team"
              width={1200}
              height={900}
              className="h-auto w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section id="community" className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            Early access • educator feedback • pilot relationships
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Join Our Community.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Join the educators, schools, families, and supporters helping shape a
            stronger future for Braille literacy. If you want to follow BrailleBox,
            explore a pilot, or stay close to the mission, this is where to start.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:hello@braille-box.com?subject=Join%20Our%20Community"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-medium text-slate-950 transition hover:scale-[1.01] hover:bg-white/90"
            >
              Join Our Community
            </a>
            <a
              href="mailto:hello@braille-box.com?subject=Pilot%20Interest"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ask about pilot access
            </a>
          </div>
          <p className="mt-6 text-sm text-white/45">
            Preview build by Nemo. Private development version — not yet connected
            to the live production domain.
          </p>
        </div>
      </section>
    </main>
  );
}
