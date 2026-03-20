import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const hardwareMoments = [
  {
    title: "Tactile by design",
    body: "BrailleBox is meant to feel intentional in the hand: focused, durable, and built around the physical reality of Braille learning.",
  },
  {
    title: "Designed to command attention",
    body: "The product should not feel like a compromise. It should feel like serious technology made for serious learning.",
  },
  {
    title: "Built for repeated classroom use",
    body: "A strong product experience matters because students and educators have to want to come back to it again and again.",
  },
];

const softwareMoments = [
  "Teacher-facing visibility into student progress",
  "A clearer signal on what is being practiced and where support is needed next",
  "A connected system that turns interaction into understanding",
];

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(1,194,194,0.20),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,99,71,0.18),transparent_24%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-28">
          <div className="relative z-10 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Our Product</div>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Hardware and software,
              <br />
              built as one experience.
            </h1>
            <p className="mt-7 text-lg leading-8 text-white/74 sm:text-xl">
              BrailleBox is a tactile learning device paired with a teacher-facing
              dashboard. The vision is not just to look better. It is to make the
              full learning loop feel sharper, clearer, and more powerful as you
              move from student interaction to teacher understanding.
            </p>
          </div>
          <div className="relative z-10 flex items-center justify-center lg:justify-end">
            <div className="hero-device-shell w-full max-w-3xl rounded-[2.8rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-6">
              <div className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-6 sm:p-8">
                <Image src="/assets/device-alt.png" alt="BrailleBox product hero" width={1600} height={1200} priority className="h-auto w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Hardware</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              The product should feel premium before it says a word.
            </h2>
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div className="rounded-[2rem] border border-black/8 bg-[#f5fffe] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <Image src="/assets/device-detail.png" alt="BrailleBox close-up detail" width={1800} height={1400} className="w-full rounded-[1.5rem] object-cover" />
            </div>
            <div className="grid gap-5">
              {hardwareMoments.map((item) => (
                <div key={item.title} className="rounded-[1.8rem] border border-black/8 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/6 bg-[#f7fbfb]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.95fr_1.05fr] lg:px-10 lg:items-center">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-orange)]">Software</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              A dashboard that turns activity into insight.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              The software side of BrailleBox is about giving teachers a stronger
              view into what is happening, not just storing data in another dead
              interface. The point is clarity.
            </p>
            <div className="mt-8 space-y-4">
              {softwareMoments.map((moment) => (
                <div key={moment} className="rounded-[1.4rem] border border-black/8 bg-white px-5 py-4 text-base leading-7 text-slate-700">
                  {moment}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <Image src="/assets/dashboard.webp" alt="BrailleBox teacher dashboard" width={1600} height={1200} className="w-full rounded-[1.5rem] object-cover" />
          </div>
        </div>
      </section>

      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">One system</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              The real story is the loop between them.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              BrailleBox matters when the device and the dashboard stop feeling
              separate. The student interacts. The teacher understands. The school
              gets a clearer picture. That is the experience we are building
              toward.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_20px_60px_rgba(2,6,23,0.16)]">
              <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">01</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">Student practice</h3>
              <p className="mt-4 text-base leading-7 text-white/72">Tactile interaction that feels intentional and engaging.</p>
            </div>
            <div className="rounded-[2rem] bg-[var(--bb-dark-teal)] p-8 text-white shadow-[0_20px_60px_rgba(0,128,128,0.18)]">
              <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">02</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">Teacher visibility</h3>
              <p className="mt-4 text-base leading-7 text-white/78">A clearer view of progress, patterns, and what to do next.</p>
            </div>
            <div className="rounded-[2rem] bg-[var(--bb-orange)] p-8 text-white shadow-[0_20px_60px_rgba(255,99,71,0.18)]">
              <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">03</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">School understanding</h3>
              <p className="mt-4 text-base leading-7 text-white/82">A stronger signal around Braille learning and instructional progress.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-gradient text-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10">
          <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Still early. Already serious.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/88">
            BrailleBox is being shaped through real feedback, real pilots, and a
            product standard that refuses to treat accessibility like an afterthought.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
