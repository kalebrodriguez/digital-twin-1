import { useEffect, useState } from "react";

// Demo voice via the browser's built-in text-to-speech (Web Speech API).
// No backend or audio files needed — works on GitHub Pages. In the real
// product this would be a cloned family-member voice (e.g. ElevenLabs).

let voices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const got = window.speechSynthesis.getVoices();
  if (got.length) voices = got;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  // Most browsers load voices asynchronously.
  window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
}

// Best-sounding voices first. "Premium"/"Enhanced" are Apple's natural
// voices (exposed in Safari once downloaded in System Settings); Google's
// network voices are the best Chrome offers by default.
const PREFERRED = [
  "Ava (Premium)", "Zoe (Premium)", "Samantha (Enhanced)", "Ava", "Zoe",
  "Google US English", "Samantha", "Karen", "Moira", "Google UK English Female",
];

function pickVoice(): SpeechSynthesisVoice | null {
  for (const name of PREFERRED) {
    const v = voices.find((v) => v.name === name) ?? voices.find((v) => v.name.includes(name));
    if (v) return v;
  }
  return (
    voices.find((v) => v.lang === "en-US") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0] ??
    null
  );
}

let current: SpeechSynthesisUtterance | null = null;
const listeners = new Set<() => void>();
let speakingId: string | null = null;

function notify() {
  listeners.forEach((fn) => fn());
}

function speakNow(text: string, id: string) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.rate = 0.95; // a touch slower — calmer for the listener
  u.pitch = 1.0;
  u.onend = u.onerror = () => {
    if (current === u) {
      current = null;
      speakingId = null;
      notify();
    }
  };
  current = u;
  speakingId = id;
  notify();
  synth.speak(u);
}

export function speak(text: string, id: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  loadVoices();
  if (voices.length) {
    speakNow(text, id);
    return;
  }
  // Voice list not ready yet (first interaction) — wait briefly for it so
  // we don't get stuck with the low-quality default voice.
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    loadVoices();
    speakNow(text, id);
  };
  window.speechSynthesis.addEventListener?.("voiceschanged", go, { once: true });
  setTimeout(go, 250);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  current = null;
  speakingId = null;
  notify();
}

/** Returns the id of whatever is currently being spoken (null when silent). */
export function useSpeakingId(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setId(speakingId);
    listeners.add(update);
    loadVoices();
    return () => {
      listeners.delete(update);
    };
  }, []);
  return id;
}
