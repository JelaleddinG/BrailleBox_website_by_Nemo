import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SchoolsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="For Schools"
        title="A stronger Braille learning system for schools and districts."
        description="BrailleBox helps schools support visually impaired students with a more connected approach to learning, teacher visibility, and progress understanding."
      />
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Current-day assistive technology</h2><p className="mt-4 text-slate-600 leading-7">A product experience built for today’s classrooms, not inherited from the past.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Better visibility</h2><p className="mt-4 text-slate-600 leading-7">A connected system that helps schools understand student learning more clearly.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Mission with rigor</h2><p className="mt-4 text-slate-600 leading-7">Built for institutions that care about accessibility, literacy, and educational quality.</p></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
