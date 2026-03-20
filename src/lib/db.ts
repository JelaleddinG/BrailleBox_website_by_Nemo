import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "braillebox.db");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    school TEXT,
    organization TEXT,
    role TEXT DEFAULT 'Teacher of the Visually Impaired',
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS verification_codes (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    name TEXT NOT NULL,
    grade TEXT,
    age INTEGER,
    profile_summary TEXT,
    strengths TEXT,
    support_needs TEXT,
    goals TEXT,
    preferred_learning_style TEXT,
    progress_percent INTEGER DEFAULT 0,
    current_focus TEXT,
    recent_activity TEXT,
    notes TEXT,
    device_connected INTEGER DEFAULT 0,
    device_name TEXT,
    device_serial TEXT,
    device_mac TEXT,
    last_exercise_title TEXT,
    last_exercise_category TEXT,
    last_exercise_score INTEGER DEFAULT 0,
    activity_visual TEXT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  );
`);

const teacherColumns = db.prepare("PRAGMA table_info(teachers)").all() as Array<{ name: string }>;
const teacherColumnSet = new Set(teacherColumns.map((c) => c.name));
const teacherExtras: Array<[string, string]> = [
  ["organization", "TEXT"],
  ["is_verified", "INTEGER DEFAULT 0"],
];
for (const [name, type] of teacherExtras) {
  if (!teacherColumnSet.has(name)) db.exec(`ALTER TABLE teachers ADD COLUMN ${name} ${type};`);
}

const studentColumns = db.prepare("PRAGMA table_info(students)").all() as Array<{ name: string }>;
const existingColumns = new Set(studentColumns.map((c) => c.name));
const extraColumns: Array<[string, string]> = [
  ["age", "INTEGER"],
  ["profile_summary", "TEXT"],
  ["strengths", "TEXT"],
  ["support_needs", "TEXT"],
  ["goals", "TEXT"],
  ["preferred_learning_style", "TEXT"],
  ["notes", "TEXT"],
  ["device_connected", "INTEGER DEFAULT 0"],
  ["device_name", "TEXT"],
  ["device_serial", "TEXT"],
  ["device_mac", "TEXT"],
  ["last_exercise_title", "TEXT"],
  ["last_exercise_category", "TEXT"],
  ["last_exercise_score", "INTEGER DEFAULT 0"],
  ["activity_visual", "TEXT"],
];
for (const [name, type] of extraColumns) {
  if (!existingColumns.has(name)) db.exec(`ALTER TABLE students ADD COLUMN ${name} ${type};`);
}

const existingTeacher = db.prepare("SELECT id FROM teachers WHERE email = ?").get("test@test.edu") as { id?: string } | undefined;

if (!existingTeacher) {
  const teacherId = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync("password", 10);

  db.prepare(
    `INSERT INTO teachers (id, name, email, password_hash, school, organization, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
  ).run(
    teacherId,
    "Demo Teacher",
    "test@test.edu",
    passwordHash,
    "Sherlock Center Pilot",
    "Sherlock Center",
    "Teacher of the Visually Impaired",
  );

  const seedStudents = [
    {
      id: crypto.randomUUID(),
      teacher_id: teacherId,
      name: "Ava",
      grade: "Grade 2",
      age: 7,
      progress_percent: 62,
      current_focus: "Letter patterns",
      recent_activity: "Completed 3 dot-recognition exercises today",
      profile_summary: "Ava is building confidence with early Braille patterns and responds well to repetition with clear tactile cues.",
      strengths: "High engagement during guided exercises; strong recognition of familiar patterns.",
      support_needs: "Needs reinforcement when moving from recognition to independent recall.",
      goals: "Improve consistency across letter recognition and guided reading tasks.",
      preferred_learning_style: "Short guided sessions with repeated tactile practice.",
      notes: "Responds well to praise and structured repetition.",
    },
    {
      id: crypto.randomUUID(),
      teacher_id: teacherId,
      name: "Noah",
      grade: "Grade 4",
      age: 10,
      progress_percent: 78,
      current_focus: "Braille fluency",
      recent_activity: "Improved speed across guided reading session",
      profile_summary: "Noah is progressing toward stronger reading fluency and benefits from timed practice with immediate feedback.",
      strengths: "Strong motivation and good retention across repeated sessions.",
      support_needs: "Needs pacing support when accuracy drops under time pressure.",
      goals: "Increase fluency while maintaining reading accuracy.",
      preferred_learning_style: "Timed fluency work with visible progress milestones.",
      notes: "Engages more deeply when goals are explicit and measurable.",
    },
    {
      id: crypto.randomUUID(),
      teacher_id: teacherId,
      name: "Liam",
      grade: "Grade 1",
      age: 6,
      progress_percent: 41,
      current_focus: "Dot recognition",
      recent_activity: "Needs reinforcement on lower cell combinations",
      profile_summary: "Liam is in an early stage of Braille recognition and benefits from short, highly supported tactile sessions.",
      strengths: "Curious and willing to try new exercises with support.",
      support_needs: "Needs repeated exposure to lower cell combinations and slower pacing.",
      goals: "Build a stronger foundation in dot recognition and early combinations.",
      preferred_learning_style: "Short sessions with simple tactile repetition and immediate correction.",
      notes: "Progress improves when distractions are minimized.",
    },
  ];

  const insertStudent = db.prepare(
    `INSERT INTO students (id, teacher_id, name, grade, age, progress_percent, current_focus, recent_activity, profile_summary, strengths, support_needs, goals, preferred_learning_style, notes)
     VALUES (@id, @teacher_id, @name, @grade, @age, @progress_percent, @current_focus, @recent_activity, @profile_summary, @strengths, @support_needs, @goals, @preferred_learning_style, @notes)`
  );

  for (const student of seedStudents) insertStudent.run(student);
}

export { db };
