import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductScrollShowcase } from "@/components/product-scroll-showcase";

const featurePanels = [
  {
    title: "A tactile learning surface",
    body: "The physical layout matters because Braille learning is tactile. The device has to be clear, usable, and consistent in the hand.",
    color: "bg-slate-950 text-white",
  },
  {
    title: "A clearer teacher view",
    body: "The dashboard should help educators understand progress and respond more confidently, without adding another disconnected workflow.",
    color: "bg-[var(--bb-dark-teal)] text-white",
  },
  {
    title: "One connected learning loop",
    body: "Student work, teacher insight, and school understanding should connect into one system instead of living in separate fragments.",
    color: "bg-[var(--bb-orange)] text-white",
  },
];

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />

      <ProductScrollShowcase />

      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Software layer</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Then the dashboard comes into view.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              The software helps educators understand progress more clearly and
              act sooner, without forcing everything back into manual tracking.
            </p>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div className="space-y-4 text-base leading-7 text-slate-700">
              <p>• clearer teacher visibility</p>
              <p>• a stronger signal from student interaction</p>
              <p>• less friction between practice and understanding</p>
            </div>
            <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <Image src="/assets/dashboard.webp" alt="BrailleBox teacher dashboard" width={1600} height={1200} className="w-full rounded-[1.5rem] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Product details</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Built to work as one system.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {featurePanels.map((panel) => (
              <div key={panel.title} className={`rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] ${panel.color}`}>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">{panel.title}</h3>
                <p className="mt-4 text-base leading-7 text-white/80">{panel.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-gradient text-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10">
          <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Hardware and software, working together.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/88">
            BrailleBox is strongest when the device, the teacher view, and the
            learning loop make sense together.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
