import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewStudentForm } from "@/components/dashboard/new-student-form";
import Link from "next/link";

export default async function NewStudentPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <main className="min-h-screen bg-[#f8fbfb] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <Link href="/dashboard" className="panel-back">← Back</Link>
          <div className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">New Student</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Create a student profile.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Add the basics first. Then use the profile draft action to build a fuller student profile.</p>
          <div className="mt-8">
            <NewStudentForm />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
