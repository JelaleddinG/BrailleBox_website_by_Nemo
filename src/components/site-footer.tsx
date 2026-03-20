import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_.8fr_.8fr] lg:px-10">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            BrailleBox
          </h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
            A Braille learning system designed to help visually impaired
            students, educators, and schools work with better tools and better
            visibility.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Explore
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
            <Link href="/tvis" className="footer-link">TVIs</Link>
            <Link href="/schools" className="footer-link">Schools</Link>
            <Link href="/parents" className="footer-link">Parents</Link>
            <Link href="/product" className="footer-link">Our Product</Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Connect
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <a href="mailto:hello@braille-box.com">hello@braille-box.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
