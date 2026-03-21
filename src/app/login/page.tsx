import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#07111d_0%,#008080_50%,#01c2c2_100%)] text-slate-950">
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center justify-center px-6 py-16 lg:px-10">
        <div className="text-center text-white">
          <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Welcome Back</div>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Select your portal</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">Choose your role to access the BrailleBox system.</p>
        </div>

        <div className="mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-3">
          <Link href="/login/teacher" className="group rounded-[2rem] border border-white/10 bg-white/8 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/14 hover:border-[var(--bb-teal)]/55">
            <div className="mb-5 h-[2px] w-16 rounded-full bg-[var(--bb-teal)]/80" />
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Teacher</h2>
            <p className="mt-3 text-sm text-white/80">Access student data, connect devices, create lessons, and track progress.</p>
            <div className="mt-6 text-sm font-medium text-[var(--bb-teal)]">Login →</div>
          </Link>

          <Link href="/login/parent" className="group rounded-[2rem] border border-white/10 bg-white/8 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/14 hover:border-[var(--bb-orange)]/55">
            <div className="mb-5 h-[2px] w-16 rounded-full bg-[var(--bb-orange)]/80" />
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Parent</h2>
            <p className="mt-3 text-sm text-white/70">View your child&apos;s progress, see teacher comments, and send messages.</p>
            <div className="mt-6 text-sm font-medium text-[var(--bb-orange)]">Login →</div>
          </Link>

          <Link href="/login/admin" className="group rounded-[2rem] border border-white/10 bg-white/8 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/14 hover:border-[var(--bb-blue)]/55">
            <div className="mb-5 h-[2px] w-16 rounded-full bg-[var(--bb-blue)]/80" />
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">School Admin</h2>
            <p className="mt-3 text-sm text-white/70">Manage accounts and generate compliance reports.</p>
            <div className="mt-6 text-sm font-medium text-[var(--bb-blue)]">Login →</div>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-white/60">
          Don&apos;t have an account? <Link href="/register" className="auth-link font-medium underline underline-offset-4">Register here</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
