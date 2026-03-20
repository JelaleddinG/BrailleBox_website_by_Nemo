import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="About Us"
        title="Built around a belief that Braille literacy matters."
        description="BrailleBox exists to help push Braille education toward better tools, clearer feedback, and a higher standard of product quality."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:px-10">
        <div className="text-lg leading-8 text-slate-600">
          <p>
            BrailleBox is mission-driven, product-focused, and built with the belief
            that accessible literacy deserves technology that feels serious,
            modern, and worthy of the classroom.
          </p>
          <p className="mt-6">
            The company is currently piloting, learning from educator feedback,
            and building toward a stronger future for Braille instruction.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Image src="/assets/team.png" alt="BrailleBox team" width={1200} height={900} className="w-full rounded-[1.5rem] object-cover" />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
