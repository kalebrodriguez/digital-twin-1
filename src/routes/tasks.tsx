import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Volume2, CheckCircle2 } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";
import { completeTask, skipTask, useDayTasks } from "@/lib/dayStore";
import { speak, stopSpeaking, useSpeakingId } from "@/lib/speech";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Today — DigitalTwin" }, { name: "description", content: "Your day, one gentle step at a time." }] }),
  component: TasksPage,
});

function TasksPage() {
  const tasks = useDayTasks();
  const speakingId = useSpeakingId();
  const [celebrate, setCelebrate] = useState<string | null>(null);

  const complete = (id: string) => {
    completeTask(id);
    setCelebrate(id);
    setTimeout(() => setCelebrate(null), 1500);
  };
  const skip = (id: string) => skipTask(id);

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
          <button
            onClick={() =>
              speakingId === next.id ? stopSpeaking() : speak(next.voice, next.id)
            }
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-2 text-sm font-semibold transition active:scale-[0.98] ${speakingId === next.id ? "bg-white text-primary" : "bg-white/20"}`}
          >
            <Volume2 className={`h-4 w-4 ${speakingId === next.id ? "animate-pulse" : ""}`} />
            {speakingId === next.id ? "Playing…" : "Play in Sarah's voice"}
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
            {t.status === "skipped" && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive">Skipped</span>
            )}
            {(t.status === "later" || t.status === "skipped") && (
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
