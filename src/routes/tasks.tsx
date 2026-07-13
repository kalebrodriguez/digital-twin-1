import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Volume2, CheckCircle2 } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Today — MindBridge" }, { name: "description", content: "Your day, one gentle step at a time." }] }),
  component: TasksPage,
});

type Task = {
  id: string;
  emoji: string;
  title: string;
  time: string;
  voice: string;
  status: "done" | "next" | "later";
};

const initial: Task[] = [
  { id: "1", emoji: "☀️", title: "Good morning", time: "7:30 AM", voice: "Time to wake up gently.", status: "done" },
  { id: "2", emoji: "💊", title: "Morning medicine", time: "7:45 AM", voice: "Take your blue pill with water.", status: "done" },
  { id: "3", emoji: "🥣", title: "Eat breakfast", time: "8:00 AM", voice: "Sarah made oatmeal for you.", status: "done" },
  { id: "4", emoji: "🦷", title: "Brush your teeth", time: "8:30 AM", voice: "Hi John, it's time to brush your teeth.", status: "next" },
  { id: "5", emoji: "🚶", title: "A short walk", time: "10:00 AM", voice: "A little fresh air feels wonderful.", status: "later" },
  { id: "6", emoji: "💧", title: "Drink water", time: "11:00 AM", voice: "A glass of water keeps you strong.", status: "later" },
  { id: "7", emoji: "🍲", title: "Lunch with Sarah", time: "12:30 PM", voice: "Sarah will call you at lunchtime.", status: "later" },
];

function TasksPage() {
  const [tasks, setTasks] = useState(initial);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  const complete = (id: string) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: "done" } : x)));
    setCelebrate(id);
    setTimeout(() => setCelebrate(null), 1500);
  };
  const skip = (id: string) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: "later" } : x)));

  const next = tasks.find((t) => t.status === "next") ?? tasks.find((t) => t.status === "later");
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <PatientShell title="Today" showBack>
      <p className="text-muted-foreground">Tuesday, November 4</p>

      <div className="mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold">
          <span>Your day</span>
          <span className="text-muted-foreground">{done} of {tasks.length}</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all"
            style={{ width: `${(done / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {next && next.status === "next" && (
        <section className="mt-5 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.68_0.11_220)] p-5 text-primary-foreground shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Right now</p>
          <div className="mt-1 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-3xl">{next.emoji}</div>
            <div>
              <p className="font-display text-2xl font-semibold leading-tight">{next.title}</p>
              <p className="text-sm opacity-90">{next.time}</p>
            </div>
          </div>
          <p className="mt-3 rounded-2xl bg-white/15 px-4 py-3 text-sm leading-relaxed">"{next.voice}"</p>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/20 py-2 text-sm font-semibold">
            <Volume2 className="h-4 w-4" /> Play in Sarah's voice
          </button>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => skip(next.id)}
              className="rounded-2xl bg-white/15 py-4 text-base font-bold active:scale-[0.98]"
            >
              <X className="mx-auto mb-1 h-6 w-6" /> Skip
            </button>
            <button
              onClick={() => complete(next.id)}
              className="rounded-2xl bg-white py-4 text-base font-bold text-primary shadow active:scale-[0.98]"
            >
              <Check className="mx-auto mb-1 h-6 w-6" /> Done
            </button>
          </div>
        </section>
      )}

      <ul className="mt-6 space-y-3">
        {tasks.filter((t) => t.status !== "next").map((t) => (
          <li
            key={t.id}
            className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
              t.status === "done"
                ? "border-transparent bg-[oklch(0.96_0.06_145)] text-muted-foreground"
                : "border-border bg-card"
            } ${celebrate === t.id ? "animate-pulse" : ""}`}
          >
            <div className={`grid h-12 w-12 place-items-center rounded-xl text-2xl ${t.status === "done" ? "bg-white/60" : "bg-accent"}`}>
              {t.status === "done" ? <CheckCircle2 className="h-6 w-6 text-secondary" /> : t.emoji}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${t.status === "done" ? "line-through" : ""}`}>{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.time}</p>
            </div>
            {t.status === "later" && (
              <button
                onClick={() => complete(t.id)}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
              >Done</button>
            )}
          </li>
        ))}
      </ul>
    </PatientShell>
  );
}
