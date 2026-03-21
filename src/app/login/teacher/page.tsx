import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TeacherLoginForm } from "@/components/teacher-login-form";
import Link from "next/link";

export default async function TeacherLoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#07111d_0%,#008080_50%,#01c2c2_100%)] text-slate-950">
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="text-white">
            <Link href="/login" className="btn-back">← Back</Link>
            <div className="mt-5 text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Teacher Portal</div>
            <h1 className="mt-4 text-6xl font-semibold tracking-[-0.06em]">Welcome back, educator.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">Access your classroom dashboard, connect BrailleBox devices, and track student progress.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <TeacherLoginForm />
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs text-white/50">Demo access:</p>
              <p className="text-sm text-white/70">Email: test@test.edu</p>
              <p className="text-sm text-white/70">Password: password</p>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
