const exerciseGroups = [
  {
    title: "Dot combinations",
    description: "Foundational exercises that build recognition of Braille cells, dot positions, and repeated tactile patterns.",
    items: ["Single-dot recognition", "Lower cell combinations", "Pattern recall", "Cell matching"],
  },
  {
    title: "Letter recognition",
    description: "Exercises that move from symbol recognition into faster, more reliable identification of letters and common patterns.",
    items: ["Letter matching", "Rapid identification", "Confusion pairs", "Teacher-guided review"],
  },
  {
    title: "Word formation",
    description: "Activities that help students move from isolated recognition into sequences, simple words, and early fluency work.",
    items: ["Short word building", "Guided spelling", "Common word practice", "Reading fluency prompts"],
  },
  {
    title: "Progress reinforcement",
    description: "Review activities that reinforce areas where the student needs more repetition or slower pacing.",
    items: ["Targeted review", "Challenge recovery", "Confidence rebuild", "Mastery check"],
  },
];

export function ExerciseCategories() {
  return (
    <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
      <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Exercise categories</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Choose the kind of practice to run.</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {exerciseGroups.map((group) => (
          <div key={group.title} className="rounded-[1.6rem] border border-black/8 p-6">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{group.title}</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">{group.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full bg-[#f8fbfb] px-3 py-2 text-sm text-slate-700">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
