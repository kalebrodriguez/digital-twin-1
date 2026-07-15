import { useEffect, useState } from "react";

// Demo voice via the browser's built-in text-to-speech (Web Speech API).
// No backend or audio files needed — works on GitHub Pages. In the real
// product this would be a cloned family-member voice (e.g. ElevenLabs).

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  // Prefer the warmer high-quality voices when the OS provides them.
  const preferred = ["Samantha", "Karen", "Moira", "Google US English"];
  for (const name of preferred) {
    const v = voices.find((v) => v.name.includes(name));
    if (v) return v;
  }
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

let current: SpeechSynthesisUtterance | null = null;
const listeners = new Set<() => void>();
let speakingId: string | null = null;

function notify() {
  listeners.forEach((fn) => fn());
}

export function speak(text: string, id: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.rate = 0.92; // a touch slower — calmer for the listener
  u.pitch = 1.02;
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
    // Some browsers load voices asynchronously; warm the list.
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    return () => {
      listeners.delete(update);
    };
  }, []);
  return id;
}
