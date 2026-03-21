function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapLines(text: string, maxLen = 92) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > maxLen) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function buildSchoolProgressPdf(data: {
  schoolName: string;
  reportDate: string;
  studentName: string;
  grade?: string;
  teacherName?: string;
  progressPercent?: number;
  currentFocus?: string;
  recentActivity?: string;
  strengths?: string;
  supportNeeds?: string;
  goals?: string;
  notes?: string;
}) {
  const reportId = `BB-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  const lines: string[] = [];
  const push = (line = "") => lines.push(line);

  push("BRAILLEBOX STUDENT PROGRESS REPORT");
  push(`${data.schoolName}`);
  push(`Report Date: ${data.reportDate}`);
  push(`Report ID: ${reportId}`);
  push("");
  push(`Student Name: ${data.studentName}`);
  push(`Grade: ${data.grade || "N/A"}`);
  push(`Teacher: ${data.teacherName || "N/A"}`);
  push(`Overall Progress: ${typeof data.progressPercent === "number" ? `${data.progressPercent}%` : "N/A"}`);
  push("");

  push("PRESENT LEVEL OF PERFORMANCE");
  wrapLines(data.currentFocus || "Current focus not set.").forEach(push);
  push("");

  push("RECENT PERFORMANCE SUMMARY");
  wrapLines(data.recentActivity || "No recent activity recorded.").forEach(push);
  push("");

  push("STRENGTHS");
  wrapLines(data.strengths || "Not documented.").forEach(push);
  push("");

  push("AREAS REQUIRING SUPPORT");
  wrapLines(data.supportNeeds || "Not documented.").forEach(push);
  push("");

  push("GOALS / OBJECTIVES");
  wrapLines(data.goals || "Not documented.").forEach(push);
  push("");

  push("TEACHER COMMENTS");
  wrapLines(data.notes || "No teacher comments added.").forEach(push);
  push("");

  push("SIGN-OFF");
  push("Teacher Signature: ______________________");
  push("Date: ______________________");
  push("");
  push("BrailleBox Confidential • For educational use only");

  let y = 790;
  const textOps: string[] = ["BT", "/F1 11 Tf", "50 800 Td"];

  for (const line of lines) {
    textOps.push(`0 -14 Td (${escapePdfText(line)}) Tj`);
    y -= 14;
    if (y < 50) break;
  }
  textOps.push("ET");

  const content = textOps.join("\n");

  const objects: string[] = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj");
  objects.push("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >> endobj");
  objects.push("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
  objects.push(`5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`);

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj + "\n";
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}

export function buildStateCompliancePdf(data: {
  schoolName: string;
  district?: string;
  state?: string;
  reportDate: string;
  reportingPeriod?: string;
  studentName: string;
  grade?: string;
  teacherName?: string;
  annualGoal?: string;
  baseline?: string;
  measurementMethod?: string;
  progressPercent?: number;
  progressNarrative?: string;
  accommodations?: string;
  serviceSummary?: string;
  nextSteps?: string;
  parentCommunicationDate?: string;
}) {
  const lines: string[] = [];
  const push = (line = "") => lines.push(line);

  const reportId = `BB-COMP-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

  push("BRAILLEBOX IEP PROGRESS COMPLIANCE REPORT");
  push("Aligned to IDEA progress reporting expectations (34 CFR 300.320(a)(3))");
  push(`${data.schoolName}${data.district ? ` • ${data.district}` : ""}${data.state ? ` • ${data.state}` : ""}`);
  push(`Report Date: ${data.reportDate}`);
  push(`Reporting Period: ${data.reportingPeriod || "Current reporting cycle"}`);
  push(`Report ID: ${reportId}`);
  push("");

  push(`Student Name: ${data.studentName}`);
  push(`Grade: ${data.grade || "N/A"}`);
  push(`Case Teacher: ${data.teacherName || "N/A"}`);
  push("");

  push("ANNUAL GOAL");
  wrapLines(data.annualGoal || data.nextSteps || "Annual goal statement pending team update.").forEach(push);
  push("");

  push("BASELINE / PRESENT LEVEL");
  wrapLines(data.baseline || "Baseline performance not documented.").forEach(push);
  push("");

  push("MEASUREMENT METHOD");
  wrapLines(data.measurementMethod || "Curriculum-based Braille probes, exercise accuracy, and fluency checks.").forEach(push);
  push("");

  push("PROGRESS TOWARD GOAL");
  push(`Current Progress: ${typeof data.progressPercent === "number" ? `${data.progressPercent}%` : "N/A"}`);
  wrapLines(data.progressNarrative || "Progress narrative pending teacher update.").forEach(push);
  push("");

  push("ACCOMMODATIONS / MODIFICATIONS");
  wrapLines(data.accommodations || "Standard Braille instructional accommodations in place.").forEach(push);
  push("");

  push("SERVICES SUMMARY");
  wrapLines(data.serviceSummary || "Service delivery summary pending update.").forEach(push);
  push("");

  push("NEXT INSTRUCTIONAL STEPS");
  wrapLines(data.nextSteps || "Continue targeted intervention plan and monitor weekly.").forEach(push);
  push("");

  push("PARENT COMMUNICATION");
  push(`Last Parent Update: ${data.parentCommunicationDate || "Not documented"}`);
  push("");

  push("TEAM SIGN-OFF");
  push("Teacher Signature: ______________________");
  push("Administrator Signature: ______________________");
  push("Date: ______________________");
  push("");
  push("BrailleBox Confidential • Compliance copy for school records");

  let y = 790;
  const textOps: string[] = ["BT", "/F1 10 Tf", "46 806 Td"];
  for (const line of lines) {
    textOps.push(`0 -13 Td (${escapePdfText(line)}) Tj`);
    y -= 13;
    if (y < 46) break;
  }
  textOps.push("ET");

  const content = textOps.join("\n");
  const objects: string[] = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj");
  objects.push("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >> endobj");
  objects.push("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
  objects.push(`5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`);

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj + "\n";
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}
