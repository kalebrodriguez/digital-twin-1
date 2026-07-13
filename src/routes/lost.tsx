import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, MapPin } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/lost")({
  head: () => ({ meta: [{ title: "I'm Lost — MindBridge" }, { name: "description", content: "A calm way to ask for a little guidance." }] }),
  component: Lost,
});

function Lost() {
  const [sent, setSent] = useState(false);
  return (
    <PatientShell title="I'm Lost" showBack>
      <p className="text-muted-foreground">It's okay. We'll help you.</p>

      <div className="mt-5 rounded-3xl bg-gradient-to-br from-[oklch(0.95_0.06_60)] to-[oklch(0.97_0.03_60)] p-6 text-center">
        <Compass className="mx-auto h-12 w-12 text-[oklch(0.55_0.14_60)]" />
        <p className="mt-3 font-display text-2xl leading-tight">Would you like Sarah to help?</p>
        <p className="mt-2 text-sm text-muted-foreground">
          She'll see where you are and call you right away. This is not an emergency alert.
        </p>
        <button
          onClick={() => setSent(true)}
          disabled={sent}
          className="mt-5 w-full rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-[var(--shadow-card)] active:scale-[0.98] disabled:opacity-70"
        >
          {sent ? "Sarah has been notified 💛" : "Yes, please help me"}
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <MapPin className="h-5 w-5 text-secondary" />
        <p className="text-sm">You're near <span className="font-semibold">Elm Street Park</span>.</p>
      </div>
    </PatientShell>
  );
}
