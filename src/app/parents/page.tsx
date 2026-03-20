import { DataBarChart, DotMatrix, StatGrid } from "@/components/data-viz";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const parentStats = [
  {
    value: "2.2B",
    label: "people worldwide living with near or distance vision impairment",
  },
  {
    value: "1B",
    label: "cases that could have been prevented or are still unaddressed",
  },
  {
    value: "4×",
    label: "higher prevalence of distance vision impairment in low- and middle-income regions than in high-income regions, according to WHO",
  },
];

const parentBars = [
  { label: "People with vision impairment globally", value: 2200, tone: "blue" as const, note: "millions of people" },
  { label: "Preventable or unaddressed cases", value: 1000, tone: "orange" as const, note: "millions of people" },
  { label: "Distance vision impairment prevalence in low-/middle-income regions vs high-income regions", value: 4, tone: "teal" as const, note: "WHO regional comparison" },
];

export default function ParentsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="For Parents"
        title="Accessible literacy deserves better tools."
        description="Parents care about whether a child is learning, improving, and being supported well. BrailleBox is being built to make that picture clearer."
      />
      <section className="border-b border-black/6 bg-[#f8fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <StatGrid items={parentStats} accent="teal" />
        </div>
      </section>
      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <DataBarChart
              title="Why the broader context matters"
              subtitle="WHO data makes one thing clear: vision-related access problems are widespread, and many remain unresolved."
              data={parentBars}
            />
            <DotMatrix
              title="A simple way to see the gap"
              subtitle="Out of every 25 units shown here, about 11 represent cases that could have been prevented or still remain unaddressed within the broader global total."
              filled={11}
              total={25}
              tone="orange"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold">Learning should be visible</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Parents should not be left guessing whether progress is happening or whether support is actually working.</p>
          </div>
          <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold">Support should feel coordinated</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">A child’s learning experience should make sense across the device, the teacher, and the support system around them.</p>
          </div>
          <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold">Braille literacy matters long term</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Good tools do not replace great teaching, but they can make consistent support easier to deliver and easier to understand.</p>
          </div>
        </div>
        <p className="mt-10 text-sm leading-7 text-slate-500">Global statistics on this page are drawn from the World Health Organization’s blindness and vision impairment fact sheet and World report on vision.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
