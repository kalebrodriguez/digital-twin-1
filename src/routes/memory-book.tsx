import { createFileRoute } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/memory-book")({
  head: () => ({ meta: [{ title: "Memory Book — MindBridge" }, { name: "description", content: "A beautiful place for the people, moments and songs you love." }] }),
  component: MemoryBook,
});

const memories = [
  { emoji: "👧", title: "Sarah", subtitle: "My daughter", voice: "Hi Dad, I love you.", bg: "from-[oklch(0.9_0.09_25)] to-[oklch(0.95_0.05_25)]" },
  { emoji: "🐕", title: "Buddy", subtitle: "Our golden retriever", voice: "Buddy loved long walks in the park.", bg: "from-[oklch(0.92_0.1_90)] to-[oklch(0.96_0.05_90)]" },
  { emoji: "💍", title: "Our wedding", subtitle: "June 12, 1972", voice: "The day I married Margaret.", bg: "from-[oklch(0.9_0.08_320)] to-[oklch(0.95_0.04_320)]" },
  { emoji: "🎣", title: "Lake trips", subtitle: "Every summer with Michael", voice: "We caught the biggest fish that July.", bg: "from-[oklch(0.9_0.09_220)] to-[oklch(0.95_0.05_220)]" },
  { emoji: "🎶", title: "Our song", subtitle: "'What a Wonderful World'", voice: "You danced to this at our anniversary.", bg: "from-[oklch(0.9_0.09_145)] to-[oklch(0.95_0.05_145)]" },
  { emoji: "🏡", title: "Elm Street", subtitle: "Where you grew up", voice: "The old house with the red door.", bg: "from-[oklch(0.9_0.09_50)] to-[oklch(0.95_0.05_50)]" },
];

function MemoryBook() {
  return (
    <PatientShell title="Memories" showBack>
      <p className="text-muted-foreground">Tap a memory to hear it.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {memories.map((m) => (
          <button
            key={m.title}
            className={`flex flex-col items-start gap-2 rounded-3xl bg-gradient-to-br ${m.bg} p-4 text-left shadow-[var(--shadow-soft)] active:scale-[0.98]`}
          >
            <span className="text-4xl">{m.emoji}</span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">{m.title}</p>
              <p className="text-xs text-muted-foreground">{m.subtitle}</p>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-foreground/70">"{m.voice}"</p>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] font-semibold text-foreground">
              <Volume2 className="h-3 w-3" /> Play
            </div>
          </button>
        ))}
      </div>
    </PatientShell>
  );
}
