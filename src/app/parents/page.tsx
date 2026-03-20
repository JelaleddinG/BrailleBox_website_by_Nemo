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
        description="BrailleBox is being built to help visually impaired students learn with tools that feel thoughtful, modern, and grounded in real educational use."
      />
      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10 text-lg leading-8 text-slate-600">
        <p>
          Parents and advocates should not have to choose between mission and quality.
          BrailleBox is being built to support both: stronger learning tools and a
          stronger future for Braille literacy.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
