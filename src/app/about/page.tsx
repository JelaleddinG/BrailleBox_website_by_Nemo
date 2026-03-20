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
        description="BrailleBox exists to give Braille education better tools, clearer feedback, and a stronger standard for what this category can be."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-3xl text-lg leading-8 text-slate-600">
          <p>
            BrailleBox is being built with a simple belief: Braille literacy deserves
            better tools. The goal is not to add more noise to the classroom. The goal
            is to make student learning easier to support and easier to understand.
          </p>
          <p className="mt-6">
            The company is currently piloting, learning from educator feedback,
            and building toward a stronger future for Braille instruction.
          </p>
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
