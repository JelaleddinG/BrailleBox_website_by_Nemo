import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const tviStats = [
  {
    value: "30–40%",
    label: "national TVI vacancy rate claimed in BrailleBox strategy research and pending final source verification",
  },
  {
    value: "8–20",
    label: "students per TVI in the itinerant model cited in the BrailleBox strategy report",
  },
  {
    value: "Jan–Apr",
    label: "key district budget window for the following school year",
  },
];

export default function TVIsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="For TVIs"
        title="Built for Teachers of the Visually Impaired."
        description="BrailleBox is designed to give TVIs a clearer view of student progress with less manual friction and better day-to-day visibility."
      />
      <section className="border-b border-black/6 bg-[#f8fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            {tviStats.map((stat) => (
              <div key={stat.value} className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
                <div className="text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-dark-teal)]">{stat.value}</div>
                <p className="mt-4 text-base leading-7 text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Less guesswork</h2><p className="mt-4 text-slate-600 leading-7">See more clearly what students are practicing and where support is needed next.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Better workflow</h2><p className="mt-4 text-slate-600 leading-7">Spend less time relying on manual tracking and more time using the information to teach.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">More informed instruction</h2><p className="mt-4 text-slate-600 leading-7">Use clearer progress visibility to adjust instruction with more confidence over time.</p></div>
        </div>
        <p className="mt-10 text-sm leading-7 text-slate-500">TVI-specific staffing and caseload figures shown here are based on BrailleBox internal strategy research and are being cross-checked before final publication.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
