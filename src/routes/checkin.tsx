import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PatientShell } from "@/components/PatientShell";
import { HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/checkin")({
  head: () => ({ meta: [{ title: "Check In — MindBridge" }, { name: "description", content: "A gentle way to share how you're feeling today." }] }),
  component: CheckIn,
});

const moods = [
  { emoji: "😀", label: "Great", tone: "bg-[oklch(0.9_0.11_145)]" },
  { emoji: "🙂", label: "Okay", tone: "bg-[oklch(0.92_0.1_90)]" },
  { emoji: "😕", label: "Not sure", tone: "bg-[oklch(0.93_0.06_60)]" },
  { emoji: "😟", label: "Need help", tone: "bg-[oklch(0.9_0.11_25)]" },
] as const;

function CheckIn() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <PatientShell title="Check In" showBack>
      <p className="text-muted-foreground">Take a slow breath.</p>
      <h2 className="mt-4 font-display text-3xl leading-tight">How are you feeling today?</h2>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {moods.map((m) => {
          const active = picked === m.label;
          return (
            <button
              key={m.label}
              onClick={() => setPicked(m.label)}
              className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl border-2 transition active:scale-[0.98] ${
                active ? "border-primary shadow-[var(--shadow-card)]" : "border-transparent"
              } ${m.tone}`}
            >
              <span className="text-6xl">{m.emoji}</span>
              <span className="font-display text-lg font-semibold">{m.label}</span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-6 rounded-2xl bg-card p-5 text-center shadow-[var(--shadow-soft)]">
          {picked === "Need help" ? (
            <>
              <HeartHandshake className="mx-auto mb-2 h-8 w-8 text-destructive" />
              <p className="font-semibold">Sarah has been notified.</p>
              <p className="text-sm text-muted-foreground">She'll call you very soon.</p>
            </>
          ) : (
            <>
              <p className="font-display text-xl">Thank you for sharing, John. 💛</p>
              <p className="mt-1 text-sm text-muted-foreground">Sarah will see how you feel.</p>
            </>
          )}
        </div>
      )}
    </PatientShell>
  );
}
