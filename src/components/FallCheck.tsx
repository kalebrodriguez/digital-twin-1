import { useEffect, useState } from "react";
import { PhoneCall, ShieldAlert } from "lucide-react";
import { resolveFall, useFallAlert } from "@/lib/dayStore";
import { speak } from "@/lib/speech";
import { CallOverlay } from "./CallOverlay";

// Full-screen check-in shown on the patient side when the (simulated)
// watch detects a hard fall. Synced live, so triggering it from the
// caregiver demo control or the Emergency screen shows it everywhere.
export function FallCheck() {
  const fall = useFallAlert();
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    if (fall) {
      speak(
        "Margaret, your watch noticed a possible fall. Are you okay? If you need help, tap Call Sarah.",
        "fall-check",
      );
    }
  }, [fall?.at]);

  if (!fall) return null;

  if (calling) {
    return (
      <CallOverlay
        name="Sarah (Daughter)"
        initial="S"
        emoji="👩"
        kind="voice"
        onEnd={() => {
          setCalling(false);
          resolveFall();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[oklch(0.97_0.03_25)] p-8 text-center">
      <div className="grid h-24 w-24 place-items-center rounded-full bg-destructive/15">
        <ShieldAlert className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold leading-tight">
        We noticed a<br />possible fall.
      </h1>
      <p className="mt-3 text-xl text-foreground/70">Are you okay, Margaret?</p>
      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        <button
          onClick={resolveFall}
          className="rounded-3xl bg-secondary py-5 font-display text-2xl font-bold text-secondary-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98]"
        >
          I'm okay 👍
        </button>
        <button
          onClick={() => setCalling(true)}
          className="flex items-center justify-center gap-2 rounded-3xl bg-destructive py-5 font-display text-2xl font-bold text-destructive-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98]"
        >
          <PhoneCall className="h-6 w-6" /> Call Sarah
        </button>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Sarah has already been notified.</p>
    </div>
  );
}
