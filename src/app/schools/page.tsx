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
        description="BrailleBox helps schools support visually impaired students with a more connected approach to student practice, teacher visibility, and learning progress."
      />
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Built for current classrooms</h2><p className="mt-4 text-slate-600 leading-7">A system designed for how schools work today, not one inherited from older disconnected tools.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Better visibility</h2><p className="mt-4 text-slate-600 leading-7">A clearer way to understand student learning through connected teacher insight.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">A stronger support system</h2><p className="mt-4 text-slate-600 leading-7">Built for schools that care about accessibility, literacy, and giving educators better tools to work with.</p></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
