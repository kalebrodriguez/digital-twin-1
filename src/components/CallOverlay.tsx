import { useEffect, useState } from "react";
import { PhoneOff } from "lucide-react";

// Simulated in-app call for the demo: rings for 2s, then "connects" and
// shows a running timer. `emoji` is used as the face in video calls.
export function CallOverlay({
  name,
  initial,
  emoji,
  selfEmoji = "👵",
  kind,
  onEnd,
}: {
  name: string;
  initial: string;
  emoji: string;
  selfEmoji?: string;
  kind: "voice" | "video";
  onEnd: () => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const connected = seconds >= 2;

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = Math.max(0, seconds - 2);
  const mm = String(Math.floor(elapsed / 60));
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[oklch(0.2_0.03_255/0.96)] p-6 text-white">
      {kind === "video" && connected ? (
        <div className="relative mb-6 grid aspect-video w-full max-w-xl place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.45_0.08_255)] to-[oklch(0.3_0.05_255)]">
          <span className="text-8xl">{emoji}</span>
          <div className="absolute bottom-3 right-3 grid h-20 w-14 place-items-center rounded-xl bg-[oklch(0.35_0.05_255)] text-3xl ring-2 ring-white/30">{selfEmoji}</div>
        </div>
      ) : (
        <div className="relative mb-6">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-primary font-display text-4xl font-bold">{initial}</div>
          {!connected && (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
              <span className="absolute -inset-3 animate-pulse rounded-full border-2 border-primary/40" />
            </>
          )}
        </div>
      )}
      <p className="font-display text-3xl font-semibold">{name}</p>
      <p className="mt-1 text-lg text-white/70">
        {connected ? `${kind === "video" ? "Video call" : "On call"} · ${mm}:${ss}` : "Calling…"}
      </p>
      <button
        onClick={onEnd}
        className="mt-8 flex items-center gap-2 rounded-full bg-destructive px-8 py-4 text-lg font-bold text-destructive-foreground transition active:scale-[0.97]"
      >
        <PhoneOff className="h-6 w-6" /> End call
      </button>
    </div>
  );
}
