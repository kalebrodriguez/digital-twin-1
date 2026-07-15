import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Brain, RefreshCw, Sparkles, ChevronLeft } from "lucide-react";
import { PatientShell } from "@/components/PatientShell";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "DigitalTwin — Brain Games" },
      { name: "description", content: "Gentle memory games that keep the mind active — big buttons, no pressure, only encouragement." },
    ],
  }),
  component: GamesPage,
});

type GameId = "match" | "odd";

function GamesPage() {
  const [game, setGame] = useState<GameId | null>(null);

  return (
    <PatientShell title={game ? undefined : "Brain Games"} showBack={!game}>
      {game === null && <GamePicker onPick={setGame} />}
      {game === "match" && <MatchingPairs onBack={() => setGame(null)} />}
      {game === "odd" && <OddOneOut onBack={() => setGame(null)} />}
    </PatientShell>
  );
}

function GamePicker({ onPick }: { onPick: (g: GameId) => void }) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-start gap-3 rounded-2xl bg-accent p-4">
        <Brain className="mt-0.5 h-6 w-6 text-primary" />
        <p className="text-sm text-foreground/80">
          A few minutes a day keeps your mind active. Take your time — there's no rush and no losing.
        </p>
      </div>

      <button
        onClick={() => onPick("match")}
        className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.68_0.11_220)] p-5 text-left text-primary-foreground shadow-[var(--shadow-card)] active:scale-[0.98]"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-3xl">🃏</div>
        <div>
          <p className="text-lg font-bold leading-tight">Matching Pairs</p>
          <p className="text-sm opacity-90">Find the two cards that match</p>
        </div>
      </button>

      <button
        onClick={() => onPick("odd")}
        className="flex items-center gap-4 rounded-3xl bg-[oklch(0.95_0.09_90)] p-5 text-left text-foreground shadow-[var(--shadow-soft)] active:scale-[0.98]"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/70 text-3xl">🔍</div>
        <div>
          <p className="text-lg font-bold leading-tight">Odd One Out</p>
          <p className="text-sm text-muted-foreground">Spot the one that's different</p>
        </div>
      </button>
    </div>
  );
}

function GameHeader({ title, onBack, onReset }: { title: string; onBack: () => void; onReset: () => void }) {
  return (
    <div className="flex items-center gap-2 pt-6 pb-2">
      <button onClick={onBack} className="-ml-2 rounded-full p-2 text-muted-foreground hover:bg-accent">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <h1 className="flex-1 font-display text-2xl font-semibold">{title}</h1>
      <button onClick={onReset} className="rounded-full p-2 text-muted-foreground hover:bg-accent" aria-label="Play again">
        <RefreshCw className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ---------- Matching Pairs ---------- */

const PAIR_EMOJI = ["🌻", "🐶", "☕", "🎵", "🏡", "🌈"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MatchingPairs({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0);
  const cards = useMemo(() => {
    const picks = shuffle(PAIR_EMOJI).slice(0, 3);
    return shuffle([...picks, ...picks].map((emoji, i) => ({ id: i, emoji })));
  }, [round]);

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const isMatch = cards[a].emoji === cards[b].emoji;
    const t = setTimeout(() => {
      if (isMatch) setMatched((m) => [...m, a, b]);
      setFlipped([]);
    }, isMatch ? 400 : 900);
    return () => clearTimeout(t);
  }, [flipped, cards]);

  const won = matched.length === cards.length;

  const tap = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    setFlipped((f) => [...f, i]);
  };

  const reset = () => {
    setFlipped([]);
    setMatched([]);
    setRound((r) => r + 1);
  };

  return (
    <div>
      <GameHeader title="Matching Pairs" onBack={onBack} onReset={reset} />
      <p className="mb-4 text-muted-foreground">Tap two cards to find a matching pair.</p>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => {
          const up = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={card.id}
              onClick={() => tap(i)}
              className={`grid aspect-square place-items-center rounded-3xl text-5xl shadow-[var(--shadow-soft)] transition active:scale-[0.97] ${
                matched.includes(i)
                  ? "bg-[oklch(0.94_0.08_145)]"
                  : up
                    ? "bg-card"
                    : "bg-gradient-to-br from-primary to-[oklch(0.68_0.11_220)]"
              }`}
              aria-label={up ? card.emoji : "Hidden card"}
            >
              {up ? card.emoji : <Brain className="h-9 w-9 text-white/70" />}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[oklch(0.94_0.08_145)] p-4">
          <Sparkles className="mt-0.5 h-5 w-5 text-[oklch(0.55_0.12_145)]" />
          <div>
            <p className="font-bold">Wonderful, Margaret! You found them all. 🎉</p>
            <button onClick={reset} className="mt-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground active:scale-[0.98]">
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Odd One Out ---------- */

const ODD_ROUNDS = [
  { same: "🍎", odd: "🍐" },
  { same: "🐱", odd: "🐶" },
  { same: "🌙", odd: "⭐" },
  { same: "🌷", odd: "🌻" },
  { same: "🚗", odd: "🚌" },
];

function OddOneOut({ onBack }: { onBack: () => void }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [message, setMessage] = useState<"none" | "yes" | "gentle">("none");
  const [seed, setSeed] = useState(0);

  const round = ODD_ROUNDS[roundIdx % ODD_ROUNDS.length];
  const tiles = useMemo(() => {
    const oddAt = Math.floor(Math.random() * 4);
    return Array.from({ length: 4 }, (_, i) => (i === oddAt ? round.odd : round.same));
  }, [roundIdx, seed]);

  const finished = roundIdx >= ODD_ROUNDS.length;

  const tap = (emoji: string) => {
    if (message === "yes") return;
    if (emoji === round.odd) {
      setMessage("yes");
      setTimeout(() => {
        setMessage("none");
        setRoundIdx((r) => r + 1);
      }, 900);
    } else {
      setMessage("gentle");
    }
  };

  const reset = () => {
    setRoundIdx(0);
    setMessage("none");
    setSeed((s) => s + 1);
  };

  return (
    <div>
      <GameHeader title="Odd One Out" onBack={onBack} onReset={reset} />

      {finished ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[oklch(0.94_0.08_145)] p-4">
          <Sparkles className="mt-0.5 h-5 w-5 text-[oklch(0.55_0.12_145)]" />
          <div>
            <p className="font-bold">Amazing work, Margaret! You finished all five. 🎉</p>
            <button onClick={reset} className="mt-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground active:scale-[0.98]">
              Play again
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-1 text-muted-foreground">Tap the one that's different.</p>
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Round {roundIdx + 1} of {ODD_ROUNDS.length}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {tiles.map((emoji, i) => (
              <button
                key={i}
                onClick={() => tap(emoji)}
                className="grid aspect-square place-items-center rounded-3xl bg-card text-6xl shadow-[var(--shadow-soft)] transition active:scale-[0.97]"
              >
                {emoji}
              </button>
            ))}
          </div>

          {message === "yes" && (
            <p className="mt-4 rounded-2xl bg-[oklch(0.94_0.08_145)] p-3 text-center font-bold">That's it! Great eye. ✨</p>
          )}
          {message === "gentle" && (
            <p className="mt-4 rounded-2xl bg-accent p-3 text-center font-semibold text-foreground/80">
              Not quite — look once more, you've got this. 💙
            </p>
          )}
        </>
      )}
    </div>
  );
}
