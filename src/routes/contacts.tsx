import { createFileRoute } from "@tanstack/react-router";
import { Phone, Video, MessageSquareHeart } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/contacts")({
  head: () => ({ meta: [{ title: "Family — DigitalTwin" }, { name: "description", content: "One tap to reach the people who love you." }] }),
  component: Contacts,
});

const people = [
  { name: "Sarah", relation: "Daughter", initial: "S", color: "bg-[oklch(0.85_0.09_25)]" },
  { name: "Michael", relation: "Son", initial: "M", color: "bg-[oklch(0.85_0.09_250)]" },
  { name: "Emma", relation: "Grandkid", initial: "E", color: "bg-[oklch(0.88_0.09_145)]" },
  { name: "Dr. Lee", relation: "Doctor", initial: "L", color: "bg-[oklch(0.88_0.06_60)]" },
];

function Contacts() {
  return (
    <PatientShell title="Family" showBack>
      <p className="text-muted-foreground">Tap a photo to call.</p>
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
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1 rounded-2xl bg-secondary py-3 text-secondary-foreground active:scale-[0.98]">
                <Phone className="h-5 w-5" /><span className="text-xs font-bold">Call</span>
              </button>
              <button className="flex flex-col items-center gap-1 rounded-2xl bg-primary py-3 text-primary-foreground active:scale-[0.98]">
                <Video className="h-5 w-5" /><span className="text-xs font-bold">Video</span>
              </button>
              <button className="flex flex-col items-center gap-1 rounded-2xl bg-accent py-3 text-accent-foreground active:scale-[0.98]">
                <MessageSquareHeart className="h-5 w-5" /><span className="text-xs font-bold">I need help</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </PatientShell>
  );
}
