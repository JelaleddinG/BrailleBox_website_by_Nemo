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
    role TEXT DEFAULT 'Teacher of the Visually Impaired',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    name TEXT NOT NULL,
    grade TEXT,
    progress_percent INTEGER DEFAULT 0,
    current_focus TEXT,
    recent_activity TEXT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  );
`);

const existingTeacher = db.prepare("SELECT id FROM teachers WHERE email = ?").get("test@test.edu") as { id?: string } | undefined;

if (!existingTeacher) {
  const teacherId = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync("password", 10);

  db.prepare(
    `INSERT INTO teachers (id, name, email, password_hash, school, role) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    teacherId,
    "Demo Teacher",
    "test@test.edu",
    passwordHash,
    "Sherlock Center Pilot",
    "Teacher of the Visually Impaired",
  );

  const seedStudents = [
    [crypto.randomUUID(), teacherId, "Ava", "Grade 2", 62, "Letter patterns", "Completed 3 dot-recognition exercises today"],
    [crypto.randomUUID(), teacherId, "Noah", "Grade 4", 78, "Braille fluency", "Improved speed across guided reading session"],
    [crypto.randomUUID(), teacherId, "Liam", "Grade 1", 41, "Dot recognition", "Needs reinforcement on lower cell combinations"],
  ];

  const insertStudent = db.prepare(
    `INSERT INTO students (id, teacher_id, name, grade, progress_percent, current_focus, recent_activity) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  for (const student of seedStudents) insertStudent.run(...student);
}

export { db };
