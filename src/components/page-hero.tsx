type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-black/6 bg-[linear-gradient(180deg,#f8fbfb_0%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="max-w-4xl">
          <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">
            {eyebrow}
          </div>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
