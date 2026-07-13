import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneCall, MapPin, ShieldAlert } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency — DigitalTwin" }, { name: "description", content: "One tap to get immediate help." }] }),
  component: Emergency,
});

function Emergency() {
  const [pressed, setPressed] = useState(false);
  return (
    <PatientShell title="Emergency" showBack showEmergency={false}>
      <p className="text-muted-foreground">Press and hold if you need urgent help.</p>

      <div className="mt-6 flex flex-col items-center">
        <button
          onPointerDown={() => setPressed(true)}
          className={`grid h-56 w-56 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-[0_20px_60px_-10px_oklch(0.65_0.19_25/0.55)] transition active:scale-95 ${
            pressed ? "ring-8 ring-destructive/30" : ""
          }`}
        >
          <div className="text-center">
            <ShieldAlert className="mx-auto h-14 w-14" />
            <p className="mt-2 font-display text-2xl font-bold">Get Help</p>
          </div>
        </button>
      </div>

      {pressed && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[oklch(0.94_0.06_145)] p-4">
            <PhoneCall className="h-5 w-5 text-secondary" />
            <p className="text-sm"><span className="font-semibold">Sarah has been called.</span> She'll be there in 4 minutes.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="text-sm">Your location was shared: <span className="font-semibold">12 Elm Street</span></p>
          </div>
          <button className="w-full rounded-2xl border-2 border-destructive py-3 font-bold text-destructive">
            Also call 911
          </button>
        </div>
      )}
    </PatientShell>
  );
}
