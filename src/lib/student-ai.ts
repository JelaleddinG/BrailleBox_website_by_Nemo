type DraftInput = {
  name: string;
  grade?: string;
  age?: number;
  current_focus?: string;
  notes?: string;
};

export function generateStudentDraft(input: DraftInput) {
  const focus = input.current_focus?.trim() || "foundational Braille learning";
  const gradeText = input.grade ? `${input.grade}` : "current grade level";
  const notes = input.notes?.trim();

  return {
    profile_summary: `${input.name} is working at the ${gradeText} level with a current focus on ${focus}. The profile should help teachers keep instruction specific, consistent, and easier to follow over time.`,
    strengths: `${input.name} shows engagement during structured tasks and benefits when progress is made visible in a clear, repeatable way.${notes ? ` Observed notes: ${notes}` : ""}`,
    support_needs: `Support is likely most effective when activities stay focused on ${focus}, feedback is immediate, and pacing matches ${input.name}'s current level of confidence and consistency.`,
    goals: `Build stronger consistency in ${focus}, improve independent performance over time, and make progress easier to review after each session.`,
    preferred_learning_style: `Guided tactile practice with short, structured sessions, repeated patterns, and clear feedback loops.`,
  };
}
