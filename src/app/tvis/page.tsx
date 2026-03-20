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
        description="BrailleBox is designed to give TVIs a clearer view of student progress with less manual friction and better day-to-day visibility."
      />
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Less guesswork</h2><p className="mt-4 text-slate-600 leading-7">See more clearly what students are practicing and where support is needed next.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">Better workflow</h2><p className="mt-4 text-slate-600 leading-7">Spend less time relying on manual tracking and more time using the information to teach.</p></div>
          <div className="rounded-[2rem] border border-black/8 p-8"><h2 className="text-2xl font-semibold">More informed instruction</h2><p className="mt-4 text-slate-600 leading-7">Use clearer progress visibility to adjust instruction with more confidence over time.</p></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
