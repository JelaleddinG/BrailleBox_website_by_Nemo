import { DataBarChart, StatGrid } from "@/components/data-viz";
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
    value: "$411B",
    label: "annual global productivity loss linked to vision impairment",
  },
];

const parentBars = [
  { label: "Global vision impairment", value: 2200, tone: "blue" as const, note: "millions of people" },
  { label: "Preventable or unaddressed cases", value: 1000, tone: "orange" as const, note: "millions of people" },
  { label: "Annual productivity loss", value: 411, tone: "teal" as const, note: "US$ billions" },
];

export default function ParentsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="For Parents"
        title="Accessible literacy deserves better tools."
        description="BrailleBox is being built to help visually impaired students learn with tools that feel thoughtful, modern, and grounded in real educational use."
      />
      <section className="border-b border-black/6 bg-[#f8fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <StatGrid items={parentStats} accent="teal" />
        </div>
      </section>
      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <DataBarChart
            title="Why the bigger picture matters"
            subtitle="Global figures on this page are drawn from WHO sources."
            data={parentBars}
          />
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10 text-lg leading-8 text-slate-600">
        <p>
          Parents and advocates should not have to choose between mission and quality.
          BrailleBox is being built to support both: stronger learning tools and a
          stronger future for Braille literacy.
        </p>
        <p className="mt-8 text-sm leading-7 text-slate-500">Global statistics on this page are drawn from the World Health Organization’s blindness and vision impairment fact sheet and World report on vision.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
