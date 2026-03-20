import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="Contact Us"
        title="Request Early Access."
        description="If you want to follow BrailleBox, explore a pilot, or continue the conversation, reach out here."
      />
      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <div className="rounded-[2rem] border border-black/8 bg-[#f8fbfb] p-10 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">Start here</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">For now, early access requests can be sent directly by email while the fuller contact flow is still being shaped.</p>
          <a href="mailto:hello@braille-box.com?subject=Request%20Early%20Access" className="btn-primary mt-8">
            Email BrailleBox
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
