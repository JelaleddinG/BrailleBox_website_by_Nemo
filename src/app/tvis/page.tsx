import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function TVIsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="For TVIs"
        title="Built for Teachers of the Visually Impaired."
        description="BrailleBox is designed to help TVIs work with clearer progress visibility, less manual friction, and a stronger view into student learning."
      />
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Less guesswork</h2><p className="mt-4 text-slate-600 leading-7">A clearer signal on what students are practicing and where they need support.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Better workflow</h2><p className="mt-4 text-slate-600 leading-7">A system built to reduce manual tracking burden instead of adding another disconnected tool.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">More informed instruction</h2><p className="mt-4 text-slate-600 leading-7">Use visibility into progress to adapt instruction with more confidence over time.</p></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
