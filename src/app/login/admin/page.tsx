import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard/admin");

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#07111d_0%,#57b7d9_40%,#7ec8e3_100%)] text-slate-950">
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="text-white">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">School Administration</div>
            <h1 className="mt-4 text-6xl font-semibold tracking-[-0.06em]">District oversight and compliance.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Manage accounts, generate state-compliant reports, and monitor program effectiveness.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bb-blue)]/20 text-xs">✓</span>
                Account management for teachers and parents
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bb-blue)]/20 text-xs">✓</span>
                State-compliant report generation
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bb-blue)]/20 text-xs">✓</span>
                District-level analytics (no individual student data)
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <AdminLoginForm />
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs text-white/50">Demo access:</p>
              <p className="text-sm text-white/70">Email: admin@test.edu</p>
              <p className="text-sm text-white/70">Password: admin123</p>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
