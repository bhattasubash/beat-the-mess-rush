import express from 'express';
import fs from 'fs';
import path from 'path';
import { getInitialAppState } from '../src/data/initialData';
import { AppState, StudentProfile } from '../src/types';

const app = express();
const PORT = Number(process.env.API_PORT || 3002);
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

app.use(express.json({ limit: '2mb' }));

function ensureDb(): AppState {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initial = getInitialAppState();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as AppState;
  } catch {
    const initial = getInitialAppState();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveDb(state: AppState): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/state', (_req, res) => {
  const state = ensureDb();
  res.json(state);
});

app.put('/api/state', (req, res) => {
  const incoming = req.body as Partial<AppState>;
  if (!incoming || typeof incoming !== 'object') {
    res.status(400).json({ error: 'Invalid state payload' });
    return;
  }
  const current = ensureDb();
  const merged: AppState = {
    ...current,
    ...incoming,
  };
  saveDb(merged);
  res.json(merged);
});

app.post('/api/students', (req, res) => {
  const { name, rollNumber, hostel, room, preferredMessId, dietPreference } =
    req.body as Partial<StudentProfile>;

  if (!name?.trim() || !rollNumber?.trim()) {
    res.status(400).json({ error: 'Name and roll number are required' });
    return;
  }

  const current = ensureDb();
  const normalizedRoll = rollNumber.trim().toUpperCase();
  const existing = current.students.find(
    (s) => s.rollNumber.toUpperCase() === normalizedRoll
  );
  if (existing) {
    res.json({ student: existing, students: current.students });
    return;
  }

  const newStudent: StudentProfile = {
    id: `s-${Date.now()}`,
    name: name.trim(),
    rollNumber: normalizedRoll,
    hostel: hostel?.trim() || 'Hostel 1',
    room: room?.trim() || 'Room 101',
    preferredMessId: preferredMessId || 'north',
    dietPreference: dietPreference || 'Veg',
  };

  const updated: AppState = {
    ...current,
    students: [...current.students, newStudent],
    activeStudentId: newStudent.id,
    selectedMessId: newStudent.preferredMessId,
  };
  saveDb(updated);
  res.status(201).json({ student: newStudent, students: updated.students });
});

app.post('/api/reset', (_req, res) => {
  const fresh = getInitialAppState();
  saveDb(fresh);
  res.json(fresh);
});

// Serve static production build when available
const distDir = path.resolve(process.cwd(), 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mess Meter API server listening on http://localhost:${PORT}`);
});
