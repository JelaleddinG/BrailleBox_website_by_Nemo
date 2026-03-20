import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const schoolStats = [
  {
    value: "$1,841",
    label: "Massachusetts per-pupil VI support spending claim from BrailleBox strategy research, pending final source verification",
  },
  {
    value: "194:1",
    label: "Massachusetts student-to-TVI ratio claim from BrailleBox strategy research, pending final source verification",
  },
  {
    value: "Q1–Q2",
    label: "school budget timing matters because district purchasing decisions often lock in early for the following year",
  },
];

export default function SchoolsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="For Schools"
        title="A stronger Braille learning system for schools and districts."
        description="BrailleBox helps schools support visually impaired students with a more connected approach to student practice, teacher visibility, and learning progress."
      />
      <section className="border-b border-black/6 bg-[#f8fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            {schoolStats.map((stat) => (
              <div key={stat.value} className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
                <div className="text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-orange)]">{stat.value}</div>
                <p className="mt-4 text-base leading-7 text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Built for current classrooms</h2><p className="mt-4 text-slate-600 leading-7">A system designed for how schools work today, not one inherited from older disconnected tools.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Better visibility</h2><p className="mt-4 text-slate-600 leading-7">A clearer way to understand student learning through connected teacher insight.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">A stronger support system</h2><p className="mt-4 text-slate-600 leading-7">Built for schools that care about accessibility, literacy, and giving educators better tools to work with.</p></div>
        </div>
        <p className="mt-10 text-sm leading-7 text-slate-500">Massachusetts-specific spend and ratio figures shown here come from BrailleBox internal strategy research and remain under source verification before final publication.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
