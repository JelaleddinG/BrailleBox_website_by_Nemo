import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const team = [
  {
    name: "Jelal Gylychmuhammedov",
    title: "Founder & CEO",
    role: "Robotics Engineering · WPI '27",
    image: "/assets/jelal.webp",
  },
  {
    name: "Minh Ha",
    title: "Co-Founder & COO",
    role: "Computer Science · WPI '27",
    image: "/assets/minh.webp",
  },
  {
    name: "Octávio Ribeiro Bittar",
    title: "Co-Founder & CTO",
    role: "Electrical & Computer Engineering · WPI '27",
    image: "/assets/octavio.webp",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <PageHero
        eyebrow="About Us"
        title="Built around a belief that Braille literacy matters."
        description="BrailleBox exists to push Braille education toward better tools, clearer feedback, and a higher standard of product quality."
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

      <section className="border-t border-black/6 bg-[#f7fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Meet the Team</div>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">The people building BrailleBox.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <Image src={member.image} alt={member.name} width={240} height={240} className="h-56 w-56 rounded-full object-cover shadow-[0_20px_40px_rgba(15,23,42,0.14)]" />
                <div className="mt-6 w-full rounded-[1.6rem] border border-black/8 bg-white px-5 py-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{member.name}</h3>
                  <p className="mt-2 font-medium text-[var(--bb-dark-teal)]">{member.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--bb-orange)]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
