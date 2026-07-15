import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Video, MessageSquareHeart, CheckCircle2 } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";
import { CallOverlay } from "@/components/CallOverlay";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/contacts")({
  head: () => ({ meta: [{ title: "Family — DigitalTwin" }, { name: "description", content: "One tap to reach the people who love you." }] }),
  component: Contacts,
});

const people = [
  { name: "Sarah", relation: "Daughter", initial: "S", emoji: "👩", color: "bg-[oklch(0.85_0.09_25)]" },
  { name: "Michael", relation: "Son", initial: "M", emoji: "👨", color: "bg-[oklch(0.85_0.09_250)]" },
  { name: "Emma", relation: "Grandkid", initial: "E", emoji: "👧", color: "bg-[oklch(0.88_0.09_145)]" },
  { name: "Dr. Lee", relation: "Doctor", initial: "L", emoji: "🧑‍⚕️", color: "bg-[oklch(0.88_0.06_60)]" },
];

type Person = (typeof people)[number];

function Contacts() {
  const [call, setCall] = useState<{ person: Person; kind: "voice" | "video" } | null>(null);
  const [helped, setHelped] = useState<string | null>(null);

  const askForHelp = (p: Person) => {
    setHelped(p.name);
    speak(`Okay Margaret, I've told ${p.name} that you need help. ${p.name} will call you very soon.`, `help-${p.name}`);
    setTimeout(() => setHelped(null), 5000);
  };

  return (
    <PatientShell title="Family" showBack>
      {call && (
        <CallOverlay
          name={`${call.person.name} (${call.person.relation})`}
          initial={call.person.initial}
          emoji={call.person.emoji}
          kind={call.kind}
          onEnd={() => setCall(null)}
        />
      )}
      <p className="text-muted-foreground">Tap a button to reach someone.</p>
      <ul className="mt-5 space-y-3">
        {people.map((p) => (
          <li key={p.name} className="rounded-3xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-4">
              <div className={`grid h-16 w-16 place-items-center rounded-full ${p.color} font-display text-2xl font-bold`}>
                {p.initial}
              </div>
              <div className="flex-1">
                <p className="font-display text-xl font-semibold leading-tight">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.relation}</p>
              </div>
            </div>
            {helped === p.name ? (
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[oklch(0.94_0.08_145)] px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                <p className="text-sm font-semibold">{p.name} has been told you need help — they'll call you soon. 💛</p>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCall({ person: p, kind: "voice" })}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-secondary py-3 text-secondary-foreground transition active:scale-[0.98]"
                >
                  <Phone className="h-5 w-5" /><span className="text-xs font-bold">Call</span>
                </button>
                <button
                  onClick={() => setCall({ person: p, kind: "video" })}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-primary py-3 text-primary-foreground transition active:scale-[0.98]"
                >
                  <Video className="h-5 w-5" /><span className="text-xs font-bold">Video</span>
                </button>
                <button
                  onClick={() => askForHelp(p)}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-accent py-3 text-accent-foreground transition active:scale-[0.98]"
                >
                  <MessageSquareHeart className="h-5 w-5" /><span className="text-xs font-bold">I need help</span>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </PatientShell>
  );
}
