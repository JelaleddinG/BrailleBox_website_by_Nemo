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

export function applyTeacherSummaryInstruction(currentSummary: string, instruction: string) {
  const text = instruction.trim();
  if (!text) return currentSummary;

  const lower = text.toLowerCase();
  let updated = currentSummary || "";

  if (lower.includes("short") || lower.includes("concise")) {
    updated = updated.split(".").slice(0, 2).join(".").trim();
    if (updated && !updated.endsWith(".")) updated += ".";
  }

  if (lower.includes("detail") || lower.includes("expand")) {
    updated += ` Additional detail: ${text.replace(/^(please\s*)?/i, "")}.`;
  }

  if (lower.includes("parent friendly") || lower.includes("simple")) {
    updated = updated
      .replace(/foundational/gi, "early")
      .replace(/consistency/gi, "steady progress")
      .replace(/independent performance/gi, "working alone")
      .replace(/instruction/gi, "teaching");
  }

  if (lower.includes("focus on")) {
    const focusMatch = text.match(/focus on\s+(.+)/i);
    if (focusMatch?.[1]) {
      updated += ` New priority focus: ${focusMatch[1].trim()}.`;
    }
  }

  if (!updated.trim()) updated = text;
  return updated.trim();
}

export function generateAiProgressReport(input: {
  studentName: string;
  grade?: string;
  progressPercent?: number;
  currentFocus?: string;
  recentActivity?: string;
  strengths?: string;
  supportNeeds?: string;
  goals?: string;
}) {
  const grade = input.grade || "Student";
  const progress = typeof input.progressPercent === "number" ? `${input.progressPercent}%` : "N/A";

  return {
    summary: `${input.studentName} (${grade}) is currently at ${progress} progress with focus on ${input.currentFocus || "core Braille practice"}.`,
    wins: input.strengths || "Student is engaged and showing steady participation.",
    support: input.supportNeeds || "Continue structured, guided tactile sessions with immediate feedback.",
    nextSteps: input.goals || "Increase consistency and confidence in targeted Braille exercises.",
    recent: input.recentActivity || "No recent activity captured yet.",
    generatedAt: new Date().toISOString(),
  };
}
