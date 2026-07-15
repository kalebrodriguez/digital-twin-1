import { useEffect, useState } from "react";

// Shared day state for the demo: the patient's task list, synced across
// routes AND across browser windows (localStorage + BroadcastChannel), so
// completing a task in the patient view updates the caregiver dashboard
// live in another window.

export type TaskStatus = "done" | "next" | "later" | "skipped";

export type DayTask = {
  id: string;
  emoji: string;
  title: string;
  time: string;
  voice: string;
  status: TaskStatus;
};

export const INITIAL_TASKS: DayTask[] = [
  { id: "1", emoji: "☀️", title: "Good morning", time: "7:30 AM", voice: "Time to wake up gently.", status: "done" },
  { id: "2", emoji: "💊", title: "Morning medicine", time: "7:45 AM", voice: "Take your blue pill with water.", status: "done" },
  { id: "3", emoji: "🥣", title: "Eat breakfast", time: "8:00 AM", voice: "Sarah made oatmeal for you.", status: "done" },
  { id: "4", emoji: "🦷", title: "Brush your teeth", time: "8:30 AM", voice: "Hi Margaret, it's time to brush your teeth.", status: "next" },
  { id: "5", emoji: "🚶", title: "A short walk", time: "10:00 AM", voice: "A little fresh air feels wonderful.", status: "later" },
  { id: "6", emoji: "💧", title: "Drink water", time: "11:00 AM", voice: "A glass of water keeps you strong.", status: "later" },
  { id: "7", emoji: "🍲", title: "Lunch with Sarah", time: "12:30 PM", voice: "Sarah will call you at lunchtime.", status: "later" },
];

const KEY = "digitaltwin-day-v1";
const CHANNEL = "digitaltwin-day";

type Listener = () => void;
const listeners = new Set<Listener>();
let cached: DayTask[] | null = null;
let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = () => {
      cached = null;
      listeners.forEach((fn) => fn());
    };
  }
  return channel;
}

function read(): DayTask[] {
  if (typeof window === "undefined") return INITIAL_TASKS;
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(KEY);
    cached = raw ? (JSON.parse(raw) as DayTask[]) : INITIAL_TASKS;
  } catch {
    cached = INITIAL_TASKS;
  }
  return cached;
}

function write(tasks: DayTask[]) {
  cached = tasks;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    // storage unavailable (private mode) — in-memory state still works
  }
  getChannel()?.postMessage("update");
  listeners.forEach((fn) => fn());
}

/** After a task leaves "next", promote the first "later" task so the
 *  patient always has a current task. */
function promoteNext(tasks: DayTask[]): DayTask[] {
  if (tasks.some((t) => t.status === "next")) return tasks;
  const first = tasks.find((t) => t.status === "later");
  return first
    ? tasks.map((t) => (t.id === first.id ? { ...t, status: "next" as const } : t))
    : tasks;
}

export function completeTask(id: string) {
  write(
    promoteNext(read().map((t) => (t.id === id ? { ...t, status: "done" as const } : t)))
  );
}

export function skipTask(id: string) {
  write(
    promoteNext(read().map((t) => (t.id === id ? { ...t, status: "skipped" as const } : t)))
  );
}

export function resetDay() {
  write(INITIAL_TASKS);
}

export function addTask(title: string, time: string, emoji = "📌") {
  write([
    ...read(),
    {
      id: `custom-${Date.now()}`,
      emoji,
      title,
      time,
      voice: `Hi Margaret, ${title.toLowerCase()} — Sarah added this for you.`,
      status: "later",
    },
  ]);
}

// --- Note from caregiver to the patient's home screen, synced the same way ---

export type HomeNote = { text: string; from: string; sentAt: number };

const NOTE_KEY = "digitaltwin-note-v1";
let cachedNote: HomeNote | null | undefined; // undefined = not read yet

function readNote(): HomeNote | null {
  if (typeof window === "undefined") return null;
  if (cachedNote !== undefined) return cachedNote;
  try {
    const raw = window.localStorage.getItem(NOTE_KEY);
    cachedNote = raw ? (JSON.parse(raw) as HomeNote) : null;
  } catch {
    cachedNote = null;
  }
  return cachedNote;
}

function writeNote(note: HomeNote | null) {
  cachedNote = note;
  try {
    if (note) window.localStorage.setItem(NOTE_KEY, JSON.stringify(note));
    else window.localStorage.removeItem(NOTE_KEY);
  } catch {
    // storage unavailable — in-memory state still works
  }
  getChannel()?.postMessage("update");
  listeners.forEach((fn) => fn());
}

export function sendNote(text: string, from = "Sarah") {
  writeNote({ text, from, sentAt: Date.now() });
}

export function clearNote() {
  writeNote(null);
}

export function useHomeNote(): HomeNote | null {
  const [note, setNote] = useState<HomeNote | null>(null);

  useEffect(() => {
    const update = () => {
      cachedNote = undefined;
      setNote(readNote());
    };
    update();
    listeners.add(update);
    getChannel();
    const onStorage = (e: StorageEvent) => {
      if (e.key === NOTE_KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return note;
}

// --- Fall detection (simulated watch event), synced the same way ---

export type FallAlert = { at: number };

const FALL_KEY = "digitaltwin-fall-v1";
let cachedFall: FallAlert | null | undefined;

function readFall(): FallAlert | null {
  if (typeof window === "undefined") return null;
  if (cachedFall !== undefined) return cachedFall;
  try {
    const raw = window.localStorage.getItem(FALL_KEY);
    cachedFall = raw ? (JSON.parse(raw) as FallAlert) : null;
  } catch {
    cachedFall = null;
  }
  return cachedFall;
}

function writeFall(fall: FallAlert | null) {
  cachedFall = fall;
  try {
    if (fall) window.localStorage.setItem(FALL_KEY, JSON.stringify(fall));
    else window.localStorage.removeItem(FALL_KEY);
  } catch {
    // storage unavailable — in-memory state still works
  }
  getChannel()?.postMessage("update");
  listeners.forEach((fn) => fn());
}

export function triggerFall() {
  writeFall({ at: Date.now() });
}

export function resolveFall() {
  writeFall(null);
}

export function useFallAlert(): FallAlert | null {
  const [fall, setFall] = useState<FallAlert | null>(null);

  useEffect(() => {
    const update = () => {
      cachedFall = undefined;
      setFall(readFall());
    };
    update();
    listeners.add(update);
    getChannel();
    const onStorage = (e: StorageEvent) => {
      if (e.key === FALL_KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return fall;
}

export function useDayTasks(): DayTask[] {
  // Start from the static list so server and first client render match,
  // then hydrate from storage and subscribe to local + cross-window updates.
  const [tasks, setTasks] = useState<DayTask[]>(INITIAL_TASKS);

  useEffect(() => {
    const update = () => setTasks(read());
    update();
    listeners.add(update);
    getChannel();
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        cached = null;
        update();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return tasks;
}
