import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
        <div className="rounded-[2rem] border border-black/8 bg-[linear-gradient(135deg,#0f172a_0%,#008080_60%,#01c2c2_100%)] p-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Teacher Login</div>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">Access the BrailleBox dashboard.</h1>
            <p className="mt-5 text-lg leading-8 text-white/82">
              Log in to review student progress, monitor recent activity, and keep teaching decisions grounded in clearer information.
            </p>
          </div>
          <div className="mt-10 max-w-md rounded-[1.8rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
            <LoginForm />
            <p className="mt-5 text-sm text-white/64">Demo access: test@test.edu / password</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
