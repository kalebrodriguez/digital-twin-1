import { createFileRoute, Link } from "@tanstack/react-router";
import { Sun, Cloud, Calendar, HeartPulse, Phone, BookHeart, MessageCircle, HelpCircle, Sparkles } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindBridge — Home" },
      { name: "description", content: "A calm home screen that shows what's next, how you're feeling, and the people who love you." },
    ],
  }),
  component: PatientHome,
});

const cards = [
  { to: "/tasks", label: "Today", emoji: "📅", icon: Calendar, tone: "bg-accent text-accent-foreground" },
  { to: "/checkin", label: "Check In", emoji: "❤️", icon: HeartPulse, tone: "bg-[oklch(0.95_0.05_25)] text-foreground" },
  { to: "/contacts", label: "Family", emoji: "📞", icon: Phone, tone: "bg-[oklch(0.94_0.08_145)] text-foreground" },
  { to: "/memory-book", label: "Memories", emoji: "📖", icon: BookHeart, tone: "bg-[oklch(0.95_0.09_90)] text-foreground" },
  { to: "/messages", label: "Messages", emoji: "💬", icon: MessageCircle, tone: "bg-accent text-accent-foreground" },
  { to: "/lost", label: "I'm Lost", emoji: "🧭", icon: HelpCircle, tone: "bg-[oklch(0.94_0.06_60)] text-foreground" },
] as const;

const favorites = [
  { name: "Sarah", relation: "Daughter", initial: "S", color: "bg-[oklch(0.85_0.09_25)]" },
  { name: "Michael", relation: "Son", initial: "M", color: "bg-[oklch(0.85_0.09_250)]" },
  { name: "Emma", relation: "Grandkid", initial: "E", color: "bg-[oklch(0.88_0.09_145)]" },
];

function PatientHome() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <PatientShell>
      <div className="-mx-6 -mt-2 px-6 pt-10">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-semibold">{time}</span>
          <span className="flex items-center gap-1"><Cloud className="h-4 w-4" /> 68° Sunny</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
          Good morning,<br />John <span className="inline-block">👋</span>
        </h1>
        <p className="mt-1 text-muted-foreground">{date}</p>

        {/* What's next */}
        <Link
          to="/tasks"
          className="mt-5 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.68_0.11_220)] p-5 text-primary-foreground shadow-[var(--shadow-card)] active:scale-[0.99]"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-2xl">🦷</div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">What's next</p>
            <p className="text-lg font-bold leading-tight">Brush your teeth</p>
            <p className="text-sm opacity-90">In 15 minutes · 8:00 AM</p>
          </div>
          <Sun className="h-6 w-6 opacity-80" />
        </Link>

        {/* Favorites */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-muted-foreground">Favorite people</p>
          <div className="flex gap-3">
            {favorites.map((f) => (
              <Link
                key={f.name}
                to="/contacts"
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]"
              >
                <div className={`grid h-14 w-14 place-items-center rounded-full ${f.color} font-display text-xl font-bold text-foreground`}>
                  {f.initial}
                </div>
                <span className="text-xs font-semibold">{f.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="-mx-6 mt-6 px-6">
        <div className="grid grid-cols-2 gap-3">
          {cards.map(({ to, label, emoji, icon: Icon, tone }) => (
            <Link
              key={to}
              to={to}
              className={`group flex aspect-square flex-col justify-between rounded-3xl p-4 shadow-[var(--shadow-soft)] transition active:scale-[0.98] ${tone}`}
            >
              <div className="text-3xl">{emoji}</div>
              <div className="flex items-end justify-between">
                <span className="font-display text-lg font-semibold leading-tight">{label}</span>
                <Icon className="h-5 w-5 opacity-60" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[oklch(0.96_0.05_90)] p-4 text-sm">
          <Sparkles className="mt-0.5 h-5 w-5 text-[oklch(0.6_0.14_60)]" />
          <p className="text-foreground/80">
            You've completed <span className="font-bold">3 of 5</span> reminders today. Keep it up!
          </p>
        </div>
      </div>
    </PatientShell>
  );
}
