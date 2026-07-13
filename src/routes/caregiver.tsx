import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell, Plus, Pill, Calendar, MessageSquareHeart, MapPin, Battery,
  HeartPulse, PhoneCall, Video, CheckCircle2, AlertTriangle, Mic, ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver Dashboard — MindBridge" },
      { name: "description", content: "Everything you need to gently support your loved one, in one calm dashboard." },
    ],
  }),
  component: Caregiver,
});

function Caregiver() {
  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-bold">M</div>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">MindBridge</p>
              <p className="text-xs text-muted-foreground">Caregiver dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full border border-border bg-card p-2">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">3</span>
            </button>
            <Link to="/" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold">← Patient view</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Hero: patient status */}
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.68_0.11_220)] p-6 text-primary-foreground shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 font-display text-2xl font-bold">J</div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider opacity-80">Caring for</p>
                <p className="font-display text-2xl font-semibold">John Whitaker</p>
                <p className="text-sm opacity-90">Dad · 78 · Early-stage Alzheimer's</p>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Doing well today</span>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-3 text-sm">
              <Stat label="Reminders done" value="3/7" icon={CheckCircle2} />
              <Stat label="Mood" value="🙂 Okay" icon={HeartPulse} />
              <Stat label="Battery" value="72%" icon={Battery} />
              <Stat label="Last seen" value="Elm Park" icon={MapPin} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-3xl border border-destructive/20 bg-[oklch(0.97_0.03_25)] p-5">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-display text-lg font-semibold">1 alert</p>
              </div>
              <p className="mt-2 text-sm">John skipped his 10:00 walk reminder.</p>
              <button className="mt-3 rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">Check in with him</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 font-bold text-secondary-foreground">
                <PhoneCall className="h-4 w-4" /> Call
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-bold text-primary-foreground">
                <Video className="h-4 w-4" /> Video
              </button>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Today schedule */}
          <Card
            title="Today's schedule"
            action={<button className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add</button>}
            className="lg:col-span-2"
          >
            <ul className="divide-y divide-border">
              {[
                { time: "7:45 AM", title: "Morning medicine", icon: Pill, done: true },
                { time: "8:00 AM", title: "Breakfast", icon: Calendar, done: true },
                { time: "8:30 AM", title: "Brush teeth", icon: Calendar, done: true },
                { time: "10:00 AM", title: "Short walk", icon: Calendar, done: false, skipped: true },
                { time: "12:30 PM", title: "Lunch with Sarah", icon: Calendar, done: false },
                { time: "3:00 PM", title: "Dr. Lee — video visit", icon: Video, done: false },
                { time: "7:00 PM", title: "Evening medicine", icon: Pill, done: false },
              ].map((it) => (
                <li key={it.time} className="flex items-center gap-3 py-3">
                  <span className="w-20 text-xs font-semibold text-muted-foreground">{it.time}</span>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl ${it.done ? "bg-[oklch(0.94_0.08_145)] text-secondary" : it.skipped ? "bg-[oklch(0.95_0.06_25)] text-destructive" : "bg-accent text-accent-foreground"}`}>
                    <it.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-semibold">{it.title}</span>
                  {it.done && <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[11px] font-bold text-secondary">Done</span>}
                  {it.skipped && <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-bold text-destructive">Skipped</span>}
                  {!it.done && !it.skipped && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </li>
              ))}
            </ul>
          </Card>

          {/* Send message */}
          <Card title="Send a note" action={<MessageSquareHeart className="h-5 w-5 text-primary" />}>
            <p className="text-sm text-muted-foreground">Warm words show up on John's home screen.</p>
            <textarea
              defaultValue="Hi Dad, I'll be over at 12:30 with your favorite soup. 💛"
              className="mt-3 h-28 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-3 flex items-center gap-2">
              <button className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">Send</button>
              <button className="rounded-2xl border border-border p-2.5" aria-label="Record voice">
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              {["Today is Tuesday.", "We're going shopping later.", "I'm proud of you."].map((t) => (
                <button key={t} className="w-full rounded-full border border-border bg-accent px-3 py-1.5 text-left font-semibold">{t}</button>
              ))}
            </div>
          </Card>

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

          {/* Location & safety */}
          <Card title="Location & safety">
            <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.94_0.06_145)] to-[oklch(0.97_0.03_145)] p-4">
              <div className="flex items-center gap-2 text-secondary"><MapPin className="h-4 w-4" /><span className="text-xs font-bold uppercase">Safe zone</span></div>
              <p className="mt-1 font-display text-lg font-semibold">Home · Elm Street</p>
              <p className="text-xs text-muted-foreground">Updated 3 min ago</p>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-border p-3 text-sm">
              <span>Share location</span>
              <span className="inline-flex h-6 w-11 items-center rounded-full bg-primary p-0.5">
                <span className="h-5 w-5 translate-x-5 rounded-full bg-white transition" />
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-2xl border border-border p-3 text-sm">
              <span>Battery alerts</span>
              <span className="inline-flex h-6 w-11 items-center rounded-full bg-primary p-0.5">
                <span className="h-5 w-5 translate-x-5 rounded-full bg-white transition" />
              </span>
            </div>
          </Card>

          {/* Memory book manage */}
          <Card title="Memory book" action={<button className="text-xs font-bold text-primary">Manage</button>}>
            <p className="text-sm text-muted-foreground">42 memories · 12 voice notes</p>
            <div className="mt-3 grid grid-cols-4 gap-2 text-2xl">
              {["👧","🐕","💍","🎣","🎶","🏡","🎂","🌊"].map((e, i) => (
                <div key={i} className="grid aspect-square place-items-center rounded-xl bg-accent">{e}</div>
              ))}
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">
              <Plus className="h-4 w-4" /> Add memory
            </button>
          </Card>
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          MindBridge — Helping memories stay connected.
        </p>
      </main>
    </div>
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
