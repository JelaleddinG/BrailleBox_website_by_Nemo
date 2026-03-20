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
          <div className="grid gap-6 md:grid-cols-3">
            {parentStats.map((stat) => (
              <div key={stat.value} className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
                <div className="text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-dark-teal)]">{stat.value}</div>
                <p className="mt-4 text-base leading-7 text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
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
