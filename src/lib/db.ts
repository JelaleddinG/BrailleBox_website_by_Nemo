import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "braillebox.db");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);

// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  -- Schools table (for multi-tenant support)
  CREATE TABLE IF NOT EXISTS schools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT,
    state TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Teachers table with role and school linkage
  CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    school_id TEXT,
    role TEXT DEFAULT 'Teacher of the Visually Impaired',
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id)
  );

  -- Parents table
  CREATE TABLE IF NOT EXISTS parents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    school_id TEXT,
    phone TEXT,
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id)
  );

  -- School admins table
  CREATE TABLE IF NOT EXISTS school_admins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    school_id TEXT,
    admin_level TEXT DEFAULT 'school', -- 'school' or 'district'
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id)
  );

  CREATE TABLE IF NOT EXISTS verification_codes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_type TEXT NOT NULL, -- 'teacher', 'parent', 'admin'
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Students table (updated)
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
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  );

  -- Parent-Student linkage (many-to-many: one parent can have multiple students)
  CREATE TABLE IF NOT EXISTS parent_student (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    relationship TEXT DEFAULT 'Parent',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE(parent_id, student_id)
  );

  -- Messages between parents and teachers
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    sender_type TEXT NOT NULL, -- 'parent' or 'teacher'
    recipient_id TEXT NOT NULL,
    recipient_type TEXT NOT NULL,
    student_id TEXT, -- optional: message about specific student
    subject TEXT,
    body TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  -- Exercise sessions (for real-time data tracking)
  CREATE TABLE IF NOT EXISTS exercise_sessions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1,
    start_time TEXT NOT NULL,
    end_time TEXT,
    score INTEGER DEFAULT 0,
    accuracy REAL,
    responses TEXT, -- JSON array of responses
    device_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  -- IEP goals tracking
  CREATE TABLE IF NOT EXISTS iep_goals (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    goal_description TEXT NOT NULL,
    target_date TEXT,
    progress_notes TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'discontinued'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );
`);

// Add new columns to existing tables if they don't exist
const teacherColumns = db.prepare("PRAGMA table_info(teachers)").all() as Array<{ name: string }>;
const teacherColumnSet = new Set(teacherColumns.map((c) => c.name));
const teacherExtras: Array<[string, string]> = [
  ["school_id", "TEXT"],
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
  ["created_at", "TEXT"],
  ["updated_at", "TEXT"],
];
for (const [name, type] of extraColumns) {
  if (!existingColumns.has(name)) db.exec(`ALTER TABLE students ADD COLUMN ${name} ${type};`);
}

// Seed data (idempotent)
let school = db.prepare("SELECT id FROM schools WHERE name = ?").get("Sherlock Center") as { id: string } | undefined;
if (!school) {
  const schoolId = crypto.randomUUID();
  db.prepare("INSERT INTO schools (id, name, district, state) VALUES (?, ?, ?, ?)").run(schoolId, "Sherlock Center", "Massachusetts", "MA");
  school = { id: schoolId };
}

let teacher = db.prepare("SELECT id FROM teachers WHERE email = ?").get("test@test.edu") as { id: string } | undefined;
if (!teacher) {
  const teacherId = crypto.randomUUID();
  db.prepare(
    `INSERT INTO teachers (id, name, email, password_hash, school_id, organization, role, is_verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
  ).run(teacherId, "Demo Teacher", "test@test.edu", bcrypt.hashSync("password", 10), school.id, "Sherlock Center", "Teacher of the Visually Impaired");
  teacher = { id: teacherId };
} else {
  db.prepare("UPDATE teachers SET is_verified = 1 WHERE id = ?").run(teacher.id);
}

let parent = db.prepare("SELECT id FROM parents WHERE email = ?").get("parent@test.edu") as { id: string } | undefined;
if (!parent) {
  const parentId = crypto.randomUUID();
  db.prepare(
    `INSERT INTO parents (id, name, email, password_hash, school_id, phone, is_verified)
     VALUES (?, ?, ?, ?, ?, ?, 1)`
  ).run(parentId, "Demo Parent", "parent@test.edu", bcrypt.hashSync("parent123", 10), school.id, "555-0100");
  parent = { id: parentId };
}

let admin = db.prepare("SELECT id FROM school_admins WHERE email = ?").get("admin@test.edu") as { id: string } | undefined;
if (!admin) {
  const adminId = crypto.randomUUID();
  db.prepare(
    `INSERT INTO school_admins (id, name, email, password_hash, school_id, admin_level, is_verified)
     VALUES (?, ?, ?, ?, ?, ?, 1)`
  ).run(adminId, "Demo Admin", "admin@test.edu", bcrypt.hashSync("admin123", 10), school.id, "school");
  admin = { id: adminId };
}

const studentCount = (db.prepare("SELECT COUNT(*) as count FROM students WHERE teacher_id = ?").get(teacher.id) as { count: number }).count;
if (studentCount === 0) {
  const seedStudents = [
    { id: crypto.randomUUID(), teacher_id: teacher.id, name: "Ava", grade: "Grade 2", age: 7, progress_percent: 62, current_focus: "Letter patterns", recent_activity: "Completed 3 dot-recognition exercises today", profile_summary: "Ava is building confidence with early Braille patterns and responds well to repetition.", strengths: "High engagement during guided exercises.", support_needs: "Needs reinforcement when moving to independent recall.", goals: "Improve consistency across letter recognition tasks.", preferred_learning_style: "Short guided sessions with repeated tactile practice.", notes: "Responds well to praise and structured repetition." },
    { id: crypto.randomUUID(), teacher_id: teacher.id, name: "Noah", grade: "Grade 4", age: 10, progress_percent: 78, current_focus: "Braille fluency", recent_activity: "Improved speed across guided reading session", profile_summary: "Noah is progressing toward stronger reading fluency.", strengths: "Strong motivation and good retention.", support_needs: "Needs pacing support when accuracy drops.", goals: "Increase fluency while maintaining accuracy.", preferred_learning_style: "Timed fluency work with clear milestones.", notes: "Engages deeply when goals are explicit." },
    { id: crypto.randomUUID(), teacher_id: teacher.id, name: "Liam", grade: "Grade 1", age: 6, progress_percent: 41, current_focus: "Dot recognition", recent_activity: "Needs reinforcement on lower cell combinations", profile_summary: "Liam is in early-stage Braille recognition.", strengths: "Curious and willing to try exercises.", support_needs: "Needs repeated exposure and slower pacing.", goals: "Build a stronger foundation in dot recognition.", preferred_learning_style: "Short sessions with tactile repetition.", notes: "Progress improves when distractions are minimized." },
  ];

  const insertStudent = db.prepare(`INSERT INTO students (id, teacher_id, name, grade, age, progress_percent, current_focus, recent_activity, profile_summary, strengths, support_needs, goals, preferred_learning_style, notes) VALUES (@id, @teacher_id, @name, @grade, @age, @progress_percent, @current_focus, @recent_activity, @profile_summary, @strengths, @support_needs, @goals, @preferred_learning_style, @notes)`);
  for (const student of seedStudents) insertStudent.run(student);

  db.prepare("INSERT OR IGNORE INTO parent_student (id, parent_id, student_id, relationship) VALUES (?, ?, ?, ?)").run(crypto.randomUUID(), parent.id, seedStudents[0].id, "Parent");
}

export { db };
