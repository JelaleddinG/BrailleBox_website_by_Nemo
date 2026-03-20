import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const featurePanels = [
  {
    title: "A tactile learning surface",
    body: "BrailleBox begins with the physical object itself. The top surface, spacing, and interaction all need to feel deliberate, tactile, and focused.",
    color: "bg-slate-950 text-white",
  },
  {
    title: "A cleaner teacher view",
    body: "The software side should not feel like a disconnected admin portal. It should feel like a continuation of the product experience — clear, useful, and immediate.",
    color: "bg-[var(--bb-dark-teal)] text-white",
  },
  {
    title: "One learning loop",
    body: "Student interaction, teacher visibility, and school understanding should connect into one coherent system instead of separate fragments.",
    color: "bg-[var(--bb-orange)] text-white",
  },
];

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(1,194,194,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,99,71,0.18),transparent_24%)]" />
        <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-6 py-16 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Our Product</div>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Start with the tip.
              <br />
              Then reveal the system.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/74 sm:text-xl">
              BrailleBox should feel like a serious product from the first glance.
              A precise tactile object in front. A cleaner software layer behind it.
              And a product story that unfolds as you keep moving.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="relative w-full max-w-6xl">
              <div className="absolute inset-x-[18%] top-[18%] h-40 rounded-full bg-[radial-gradient(circle,rgba(1,194,194,0.24),transparent_66%)] blur-3xl" />
              <Image
                src="/assets/box-picture.png"
                alt="BrailleBox product tip-forward hero"
                width={2200}
                height={1400}
                priority
                className="relative z-10 h-auto w-full object-contain drop-shadow-[0_35px_80px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Hardware focus</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Zoom out. The object starts to speak for itself.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              The product page should feel like discovery. First the detail. Then
              the shape. Then the system. BrailleBox should be presented as an
              object with intention, not just a tool dropped onto a page.
            </p>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="p-0 shadow-none">
              <Image src="/assets/device-alt.png" alt="BrailleBox full product reveal" width={1800} height={1400} className="w-full object-contain drop-shadow-[0_30px_70px_rgba(15,23,42,0.16)]" />
            </div>
            <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">A tactile form built around learning.</h3>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                BrailleBox should feel focused, durable, and intentional. Not flashy.
                Not toy-like. Not “good enough for accessibility.” Just good.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/6 bg-[#f7fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-orange)]">Software layer</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Then the dashboard comes into view.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                The software should extend the product story. It is not there to
                clutter the experience. It is there to help educators understand
                progress more clearly and act with more confidence.
              </p>
              <div className="mt-8 space-y-4 text-base leading-7 text-slate-700">
                <p>• clearer teacher visibility</p>
                <p>• stronger signal from student interaction</p>
                <p>• less friction between learning and understanding</p>
              </div>
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
              Detail by detail, the full story emerges.
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
            This should feel like a reveal, not a brochure.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/88">
            The direction is clear now: fewer generic blocks, more product theater,
            stronger detail, and a better sense of progression as the page unfolds.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
