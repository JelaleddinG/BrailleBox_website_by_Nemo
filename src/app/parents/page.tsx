import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ParentsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="For Parents"
        title="Accessible literacy deserves better tools."
        description="BrailleBox is part of a broader mission to help visually impaired students learn with products that feel thoughtful, modern, and built for real educational progress."
      />
      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10 text-lg leading-8 text-slate-600">
        <p>
          Parents and advocates should not have to choose between mission and quality.
          BrailleBox is being built to push both forward at the same time.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
