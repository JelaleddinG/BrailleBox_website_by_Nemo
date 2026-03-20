import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { SiteHeader } from "@/components/site-header";

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="Our Product"
        title="A premium Braille learning system."
        description="BrailleBox combines tactile product design with connected teacher visibility to create a stronger learning loop for visually impaired students."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:px-10">
        <div className="rounded-[2rem] border border-black/8 bg-[#f5fffe] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Image src="/assets/device.jpg" alt="BrailleBox Device" width={1400} height={1100} className="w-full rounded-[1.5rem] object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-semibold tracking-[-0.04em]">Designed to feel focused, tactile, and real.</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">The product vision is not just better hardware. It is a complete system where device interaction, teacher understanding, and school visibility work together.</p>
          <div className="mt-8 space-y-4 text-base leading-7 text-slate-600">
            <p>• Tactile student interaction</p>
            <p>• Teacher-facing dashboard visibility</p>
            <p>• Stronger information loop between students and educators</p>
          </div>
        </div>
      </section>
    </main>
  );
}
