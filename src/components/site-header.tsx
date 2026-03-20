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
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.14)] bg-[linear-gradient(90deg,rgba(0,128,128,0.92),rgba(1,194,194,0.84),rgba(0,128,128,0.92))] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/18 bg-white/10 p-0 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
            <Image
              src="/assets/icon-color.png"
              alt="BrailleBox icon"
              fill
              sizes="44px"
              className="object-cover scale-[0.9]"
              priority
            />
          </div>
          <span className="text-base font-semibold tracking-[-0.03em] text-white drop-shadow-sm">BrailleBox</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/92 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--bb-yellow)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="btn-primary">
          Request Early Access
        </Link>
      </div>
    </header>
  );
}
