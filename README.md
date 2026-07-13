# DigitalTwin

**An AI daily companion for people with early-stage Alzheimer's — and real-time
peace of mind for the families who love them.**

DigitalTwin builds a live "digital twin" of a patient's day. A gentle assistant
guides Margaret through her routine — medicine, meals, a walk, calling family —
and every confirmed or missed step reaches her daughter's dashboard instantly.

**Live demo:** https://kalebrodriguez.github.io/digital-twin-1/

## The demo

Two views, one live day:

- **Patient view** (`/` and `/tasks`) — huge type, one task at a time, voice
  prompts in a family member's voice, plus Memory Book, Check In, Family,
  Messages, an "I'm Lost" helper, and a one-tap Emergency button.
- **Caregiver dashboard** (`/caregiver`) — live reminder count, today's
  schedule with Done/Skipped/Now statuses, alerts when something is missed,
  location & safety, and a "send a note to her home screen" card.

**The money moment:** open the site in **two browser windows** — patient view
in one, `/caregiver` in the other. Skip a task as Margaret and watch the
caregiver window react instantly (alert card, bell badge, schedule status).
The views sync across windows via `localStorage` + `BroadcastChannel`
(`src/lib/dayStore.ts`) — no backend needed.

This is a scripted design prototype for a pitch competition, not a production
app: data is local, and the AI voice is represented, not wired up.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Reset the demo day by clearing site data
(DevTools → Application → Local Storage) or running
`localStorage.removeItem("digitaltwin-day-v1")` in the console.

## Deploying

Pushes to `main` auto-deploy to GitHub Pages via
`.github/workflows/deploy-pages.yml` (static prerender of all routes,
served under `/digital-twin-1/`).

## Stack

React 19 · TanStack Start/Router · Tailwind CSS 4 · shadcn/ui · Vite.
Initial prototype generated with Lovable by Ishaan; rebranding, live
patient→caregiver sync, and Pages deployment added on this fork.

## Team

Kaleb Rodriguez (Technical Lead) · Saanvi Rout (Marketing Lead) ·
Ishaan Varma Kammella (Finance Lead) · Hemaprabaa Rajakumar (Flexible Team
Lead) · Hur Rauf Sirin (Flexible Team Lead)
