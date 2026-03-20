import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#07111d_0%,#008080_50%,#01c2c2_100%)] text-slate-950">
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="text-white">
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Teacher Registration</div>
            <h1 className="mt-4 text-6xl font-semibold tracking-[-0.06em]">Create your BrailleBox account.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Register with your name, email, and organization. Then verify your email before logging in.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <RegisterForm />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
