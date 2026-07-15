import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell, Plus, Pill, Calendar, MessageSquareHeart, MapPin, Battery,
  HeartPulse, PhoneCall, Video, CheckCircle2, AlertTriangle, Mic, ChevronRight,
  PhoneOff, X,
} from "lucide-react";
import { addTask, completeTask, sendNote, useDayTasks } from "@/lib/dayStore";

export const Route = createFileRoute("/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver Dashboard — DigitalTwin" },
      { name: "description", content: "Everything you need to gently support your loved one, in one calm dashboard." },
    ],
  }),
  component: Caregiver,
});

function Caregiver() {
  const tasks = useDayTasks();
  const done = tasks.filter((t) => t.status === "done").length;
  const skipped = tasks.filter((t) => t.status === "skipped");
  const ok = skipped.length === 0;

  const [call, setCall] = useState<"voice" | "video" | null>(null);
  const [bellOpen, setBellOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      {call && <CallOverlay kind={call} onEnd={() => setCall(null)} />}

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-bold">M</div>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">DigitalTwin</p>
              <p className="text-xs text-muted-foreground">Caregiver dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative rounded-full border border-border bg-card p-2 hover:bg-accent"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {!ok && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{skipped.length}</span>
                )}
              </button>
              {bellOpen && (
                <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-display font-semibold">Notifications</p>
                    <button onClick={() => setBellOpen(false)} aria-label="Close"><X className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                  {ok ? (
                    <p className="text-sm text-muted-foreground">All caught up — Mom is on track today. ✅</p>
                  ) : (
                    <ul className="space-y-2">
                      {skipped.map((t) => (
                        <li key={t.id} className="flex items-center gap-2 rounded-xl bg-[oklch(0.97_0.03_25)] p-2.5 text-sm">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                          <span className="flex-1">Missed: <b>{t.title}</b> ({t.time})</span>
                          <button
                            onClick={() => completeTask(t.id)}
                            className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground"
                          >
                            Resolve
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <Link to="/" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold">← Patient view</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Hero: patient status */}
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.68_0.11_220)] p-6 text-primary-foreground shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 font-display text-2xl font-bold">M</div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider opacity-80">Caring for</p>
                <p className="font-display text-2xl font-semibold">Margaret Whitaker</p>
                <p className="text-sm opacity-90">Mom · 78 · Early-stage Alzheimer's</p>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                {ok ? "Doing well today" : "Needs a check-in"}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-3 text-sm">
              <Stat label="Reminders done" value={`${done}/${tasks.length}`} icon={CheckCircle2} />
              <Stat label="Mood" value="🙂 Okay" icon={HeartPulse} />
              <Stat label="Battery" value="72%" icon={Battery} />
              <Stat label="Last seen" value="Elm Park" icon={MapPin} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {ok ? (
              <div className="rounded-3xl border border-secondary/20 bg-[oklch(0.96_0.05_145)] p-5">
                <div className="flex items-center gap-2 text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-display text-lg font-semibold">All on track</p>
                </div>
                <p className="mt-2 text-sm">Mom is keeping up with her day. No alerts right now.</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-destructive/20 bg-[oklch(0.97_0.03_25)] p-5">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-display text-lg font-semibold">
                    {skipped.length} alert{skipped.length > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="mt-2 text-sm">
                  Mom skipped: {skipped.map((t) => `${t.title} (${t.time})`).join(", ")}.
                </p>
                <button
                  onClick={() => skipped.forEach((t) => completeTask(t.id))}
                  className="mt-3 rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground"
                >
                  Check in with her
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCall("voice")}
                className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 font-bold text-secondary-foreground transition active:scale-[0.98]"
              >
                <PhoneCall className="h-4 w-4" /> Call
              </button>
              <button
                onClick={() => setCall("video")}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-bold text-primary-foreground transition active:scale-[0.98]"
              >
                <Video className="h-4 w-4" /> Video
              </button>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <ScheduleCard tasks={tasks} />
          <SendNoteCard />

          {/* Check-ins */}
          <Card title="Recent check-ins">
            <ul className="space-y-3 text-sm">
              {[
                { when: "Today, 8:10 AM", mood: "🙂 Okay" },
                { when: "Yesterday, 8 PM", mood: "😀 Great" },
                { when: "Yesterday, 8 AM", mood: "🙂 Okay" },
                { when: "Mon, 8 PM", mood: "😕 Not sure" },
              ].map((c) => (
                <li key={c.when} className="flex items-center justify-between rounded-2xl bg-accent px-3 py-2">
                  <span className="text-muted-foreground">{c.when}</span>
                  <span className="font-semibold">{c.mood}</span>
                </li>
              ))}
            </ul>
          </Card>

          <SafetyCard />
          <MemoryCard />
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          DigitalTwin — Helping memories stay connected.
        </p>
      </main>
    </div>
  );
}

/* ---------- Fake in-app call ---------- */

function CallOverlay({ kind, onEnd }: { kind: "voice" | "video"; onEnd: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const connected = seconds >= 2;

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = Math.max(0, seconds - 2);
  const mm = String(Math.floor(elapsed / 60)).padStart(1, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[oklch(0.2_0.03_255/0.96)] p-6 text-white">
      {kind === "video" && connected ? (
        <div className="relative mb-6 grid aspect-video w-full max-w-xl place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.45_0.08_255)] to-[oklch(0.3_0.05_255)]">
          <span className="text-8xl">👵</span>
          <div className="absolute bottom-3 right-3 grid h-20 w-14 place-items-center rounded-xl bg-[oklch(0.35_0.05_255)] text-3xl ring-2 ring-white/30">👩</div>
        </div>
      ) : (
        <div className="relative mb-6">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-primary font-display text-4xl font-bold">M</div>
          {!connected && (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
              <span className="absolute -inset-3 animate-pulse rounded-full border-2 border-primary/40" />
            </>
          )}
        </div>
      )}
      <p className="font-display text-2xl font-semibold">Margaret (Mom)</p>
      <p className="mt-1 text-white/70">
        {connected ? `${kind === "video" ? "Video call" : "On call"} · ${mm}:${ss}` : "Calling…"}
      </p>
      <button
        onClick={onEnd}
        className="mt-8 flex items-center gap-2 rounded-full bg-destructive px-6 py-3 font-bold text-destructive-foreground transition active:scale-[0.97]"
      >
        <PhoneOff className="h-5 w-5" /> End call
      </button>
    </div>
  );
}

/* ---------- Schedule with working Add ---------- */

function ScheduleCard({ tasks }: { tasks: ReturnType<typeof useDayTasks> }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("2:00 PM");

  const submit = () => {
    if (!title.trim()) return;
    addTask(title.trim(), time.trim() || "Today");
    setTitle("");
    setAdding(false);
  };

  return (
    <Card
      title="Today's schedule"
      action={
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      }
      className="lg:col-span-2"
    >
      {adding && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl bg-accent p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Water the plants"
            className="min-w-40 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            autoFocus
          />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-24 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button onClick={submit} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            Add to Mom's day
          </button>
        </div>
      )}
      <ul className="divide-y divide-border">
        {tasks.map((it) => {
          const isDone = it.status === "done";
          const isSkipped = it.status === "skipped";
          const isNow = it.status === "next";
          const Icon = it.title.toLowerCase().includes("medicine") ? Pill : Calendar;
          return (
            <li key={it.id} className="flex items-center gap-3 py-3">
              <span className="w-20 text-xs font-semibold text-muted-foreground">{it.time}</span>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${isDone ? "bg-[oklch(0.94_0.08_145)] text-secondary" : isSkipped ? "bg-[oklch(0.95_0.06_25)] text-destructive" : "bg-accent text-accent-foreground"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-semibold">{it.title}</span>
              {isDone && <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[11px] font-bold text-secondary">Done</span>}
              {isSkipped && <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-bold text-destructive">Skipped</span>}
              {isNow && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">Now</span>}
              {!isDone && !isSkipped && !isNow && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ---------- Send a note (delivers to patient home screen live) ---------- */

function SendNoteCard() {
  const [text, setText] = useState("Hi Mom, I'll be over at 12:30 with your favorite soup. 💛");
  const [sent, setSent] = useState(false);
  const [recording, setRecording] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    sendNote(text.trim());
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  const record = () => {
    if (recording) return;
    setRecording(true);
    setTimeout(() => {
      setText("Hi Mom, just thinking of you — call me when you're free. 💛");
      setRecording(false);
    }, 2000);
  };

  return (
    <Card title="Send a note" action={<MessageSquareHeart className="h-5 w-5 text-primary" />}>
      <p className="text-sm text-muted-foreground">Warm words show up on Margaret's home screen.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-3 h-28 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={send}
          className={`flex-1 rounded-2xl py-2.5 text-sm font-bold transition ${sent ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground active:scale-[0.98]"}`}
        >
          {sent ? "Delivered to Mom's home screen ✓" : "Send"}
        </button>
        <button
          onClick={record}
          className={`rounded-2xl border p-2.5 transition ${recording ? "animate-pulse border-destructive bg-destructive/10 text-destructive" : "border-border"}`}
          aria-label="Record voice"
        >
          <Mic className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 space-y-2 text-xs">
        {["Today is Tuesday.", "We're going shopping later.", "I'm proud of you."].map((t) => (
          <button
            key={t}
            onClick={() => setText(t)}
            className="w-full rounded-full border border-border bg-accent px-3 py-1.5 text-left font-semibold transition hover:border-primary"
          >
            {t}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Location & safety with working toggles ---------- */

function SafetyCard() {
  const [share, setShare] = useState(true);
  const [battery, setBattery] = useState(true);
  return (
    <Card title="Location & safety">
      <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.94_0.06_145)] to-[oklch(0.97_0.03_145)] p-4">
        <div className="flex items-center gap-2 text-secondary"><MapPin className="h-4 w-4" /><span className="text-xs font-bold uppercase">Safe zone</span></div>
        <p className="mt-1 font-display text-lg font-semibold">Home · Elm Street</p>
        <p className="text-xs text-muted-foreground">Updated 3 min ago</p>
      </div>
      <Toggle label="Share location" on={share} onClick={() => setShare((v) => !v)} />
      <Toggle label="Battery alerts" on={battery} onClick={() => setBattery((v) => !v)} />
    </Card>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-3 flex w-full items-center justify-between rounded-2xl border border-border p-3 text-sm">
      <span>{label}</span>
      <span className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition ${on ? "bg-primary" : "bg-muted"}`}>
        <span className={`h-5 w-5 rounded-full bg-white transition ${on ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

/* ---------- Memory book ---------- */

function MemoryCard() {
  const [memories, setMemories] = useState(["👧","🐕","💍","🎣","🎶","🏡","🎂","🌊"]);
  const pool = ["🌻","📻","🧶","🍰","⛪","🚂","🌹","📚"];
  const add = () => setMemories((m) => [...m, pool[m.length % pool.length]]);
  return (
    <Card
      title="Memory book"
      action={<Link to="/memory-book" className="text-xs font-bold text-primary">Manage</Link>}
    >
      <p className="text-sm text-muted-foreground">{34 + memories.length} memories · 12 voice notes</p>
      <div className="mt-3 grid grid-cols-4 gap-2 text-2xl">
        {memories.map((e, i) => (
          <div key={i} className="grid aspect-square place-items-center rounded-xl bg-accent">{e}</div>
        ))}
      </div>
      <button
        onClick={add}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" /> Add memory
      </button>
    </Card>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof HeartPulse }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3">
      <Icon className="h-4 w-4 opacity-80" />
      <p className="mt-2 text-xs opacity-80">{label}</p>
      <p className="font-display text-base font-semibold">{value}</p>
    </div>
  );
}

function Card({ title, action, children, className = "" }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
