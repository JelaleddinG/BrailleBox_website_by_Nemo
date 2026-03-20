import { DataBarChart, DotMatrix, StatGrid } from "@/components/data-viz";
import { MissionImpactSlider } from "@/components/mission-impact-slider";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const globalStats = [
  {
    value: "2.2B",
    label: "people worldwide with near or distance vision impairment",
  },
  {
    value: "1B",
    label: "cases that could have been prevented or still remain unaddressed",
  },
  {
    value: "$411B",
    label: "estimated annual global productivity loss linked to vision impairment",
  },
];

const burdenBars = [
  { label: "Total global vision impairment", value: 2200, tone: "blue" as const, note: "millions of people" },
  { label: "Preventable or unaddressed cases", value: 1000, tone: "orange" as const, note: "millions of people" },
  { label: "Annual productivity loss", value: 411, tone: "yellow" as const, note: "US$ billions" },
];

const problemBlocks = [
  {
    title: "Access is uneven",
    body: "WHO reports that vision impairment remains far more common in low- and middle-income regions, where access to treatment and correction is often limited.",
  },
  {
    title: "Children are affected early",
    body: "WHO notes that school-age children with vision impairment can experience lower levels of educational achievement when support is weak or delayed.",
  },
  {
    title: "The burden reaches beyond health",
    body: "Vision impairment affects education, independence, employment, and quality of life. This is not only a medical issue; it is a systems issue.",
  },
];

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="Mission"
        title="Braille literacy sits inside a much larger global problem."
        description="BrailleBox is being built in response to a real access gap: too many people live with preventable or unaddressed vision impairment, and too many learning systems still make support harder than it should be."
      />

      <section className="border-b border-black/6 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <StatGrid items={globalStats} accent="yellow" />
        </div>
      </section>

      <section className="border-b border-black/6 bg-[#f8fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Global scale</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              The numbers are big enough to demand better systems.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <DataBarChart
              title="Global burden at a glance"
              subtitle="Based on WHO blindness and vision impairment data."
              data={burdenBars}
            />
            <DotMatrix
              title="Rough visual of unaddressed burden"
              subtitle="Out of every 25 units here, roughly 11 represent preventable or still-unaddressed cases within the larger global total."
              filled={11}
              total={25}
              tone="orange"
            />
          </div>
        </div>
      </section>

      <MissionImpactSlider />

      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Why this matters</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              This is about learning, access, and long-term opportunity.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {problemBlocks.map((block) => (
              <div key={block.title} className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{block.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{block.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">What BrailleBox is responding to</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Better support systems matter as much as better tools.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              BrailleBox is being built around a simple idea: when student practice,
              teacher visibility, and school understanding connect more clearly,
              Braille instruction becomes easier to support and easier to sustain.
            </p>
          </div>
          <div className="rounded-[2rem] border border-black/8 bg-[linear-gradient(135deg,#0f172a_0%,#008080_55%,#01c2c2_100%)] p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Sources</div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/80">
              <p>World Health Organization, Blindness and vision impairment fact sheet.</p>
              <p>World Health Organization, World report on vision.</p>
              <p>Additional New England and TVI-specific claims are being verified before final publication.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
