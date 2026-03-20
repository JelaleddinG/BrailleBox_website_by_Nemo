import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/tvis", label: "TVIs" },
  { href: "/schools", label: "Schools" },
  { href: "/parents", label: "Parents" },
  { href: "/product", label: "Our Product" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(3,8,20,0.72)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/brand-logo-alt.webp"
            alt="BrailleBox"
            width={154}
            height={42}
            className="h-9 w-auto"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/82 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-[var(--bb-orange)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--bb-dark-teal)]"
        >
          Request Early Access
        </Link>
      </div>
    </header>
  );
}
