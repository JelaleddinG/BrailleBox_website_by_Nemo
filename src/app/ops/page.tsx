import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OpsBoard } from "@/components/ops/ops-board";
import Link from "next/link";

export default async function OpsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <main className="min-h-screen bg-[#f8fbfb] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <Link href="/dashboard" className="panel-back">← Back</Link>
        <div className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Ops Command Center</div>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">Agent Workflow Visibility</h1>
        <p className="mt-3 text-slate-600">Track Nemo, Builder, and QA activity in one visual space.</p>
        <OpsBoard />
      </section>
      <SiteFooter />
    </main>
  );
}
