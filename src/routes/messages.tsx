import { createFileRoute } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — MindBridge" }, { name: "description", content: "Warm notes from the people who love you." }] }),
  component: Messages,
});

const msgs = [
  { from: "Sarah", when: "This morning", text: "Good morning Dad! Today is Tuesday. I'll come by at 12:30 for lunch. 💛" },
  { from: "Michael", when: "Yesterday", text: "Proud of you for finishing your walk yesterday." },
  { from: "Emma", when: "Sunday", text: "Grandpa!! I drew you a picture — Mom will bring it over." },
];

function Messages() {
  return (
    <PatientShell title="Messages" showBack>
      <p className="text-muted-foreground">Tap the speaker to hear them.</p>
      <ul className="mt-5 space-y-3">
        {msgs.map((m, i) => (
          <li key={i} className="rounded-3xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-lg font-semibold">{m.from}</p>
              <span className="text-xs text-muted-foreground">{m.when}</span>
            </div>
            <p className="mt-2 text-base leading-relaxed">{m.text}</p>
            <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <Volume2 className="h-4 w-4" /> Play in {m.from}'s voice
            </button>
          </li>
        ))}
      </ul>
    </PatientShell>
  );
}
