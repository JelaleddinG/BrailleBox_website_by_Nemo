import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const featureCards = [
  {
    title: "Braille learning, made tangible",
    body: "A tactile product experience designed to feel focused, refined, and worthy of the students using it.",
  },
  {
    title: "Built for teacher visibility",
    body: "A system that helps educators understand progress more clearly without drowning in manual tracking.",
  },
  {
    title: "Designed for schools that care",
    body: "BrailleBox helps schools move toward a stronger learning loop between students, teachers, and outcomes.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <picture className="absolute inset-0 block h-full w-full">
          <source media="(max-width: 767px)" srcSet="/assets/home-hero-mobile.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/assets/home-hero.webp" type="image/webp" />
          <img
            src="/assets/home-hero.webp"
            alt="Finger touching the BrailleBox device"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(1,194,194,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,99,71,0.14),transparent_24%)]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-16 lg:px-10 lg:py-24">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/78 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[var(--bb-yellow)]" />
              Braille learning for students, educators, and schools
            </div>
            <h1 className="text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Braille education,
              <br />
              built like it matters.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
              BrailleBox is a hardware and software system helping visually
              impaired students learn Braille while giving educators and schools
              a clearer view of progress.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Request Early Access
              </Link>
              <Link href="/product" className="btn-secondary">
                Explore Our Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-[2rem] border border-black/7 bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/6 bg-[#f5fffe]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-24 lg:grid-cols-[.95fr_1.05fr] lg:px-10">
          <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
            <Image src="/assets/dashboard.webp" alt="BrailleBox dashboard" width={1400} height={1000} className="h-auto w-full rounded-[1.5rem] object-cover" />
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Our Product</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Hardware and software, working as one system.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              BrailleBox combines a tactile learning device with connected teacher
              visibility. The result is a clearer learning loop for students,
              educators, and schools.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium">
              <span className="rounded-full bg-[var(--bb-teal)]/12 px-4 py-2 text-[var(--bb-dark-teal)]">Braille learning</span>
              <span className="rounded-full bg-[var(--bb-orange)]/12 px-4 py-2 text-[var(--bb-orange)]">Teacher visibility</span>
              <span className="rounded-full bg-[var(--bb-yellow)]/18 px-4 py-2 text-slate-800">School insight</span>
            </div>
            <div className="mt-10">
              <Link href="/product" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bb-dark-teal)]">
                See the full product story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/tvis" className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5">
            <div className="text-sm uppercase tracking-[0.2em] text-[var(--bb-dark-teal)]">For TVIs</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">Teach with more clarity.</h3>
            <p className="mt-4 text-base leading-7 text-slate-600">A better way to track student progress and adapt instruction with less friction.</p>
          </Link>
          <Link href="/schools" className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5">
            <div className="text-sm uppercase tracking-[0.2em] text-[var(--bb-orange)]">For Schools</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">Support better Braille outcomes.</h3>
            <p className="mt-4 text-base leading-7 text-slate-600">A stronger learning system for districts and schools that want better visibility and support.</p>
          </Link>
          <Link href="/parents" className="feature-link-card">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-600">For Parents</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">Follow the mission.</h3>
            <p className="mt-4 text-base leading-7 text-slate-600">See how BrailleBox is helping push accessible literacy toward a better future.</p>
          </Link>
        </div>
      </section>

      <section className="brand-gradient text-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10">
          <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Early, but serious.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/88">
            BrailleBox is currently piloting and learning from real educator
            feedback, including Sherlock Center. If you want to stay close to the
            product, the mission, or early access, now is the right time.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Request Early Access
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
              About BrailleBox
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
