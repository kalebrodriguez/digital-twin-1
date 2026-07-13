import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ListChecks, HeartPulse, BookHeart, Users } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tasks", label: "Today", icon: ListChecks },
  { to: "/checkin", label: "Feel", icon: HeartPulse },
  { to: "/memory-book", label: "Memories", icon: BookHeart },
  { to: "/contacts", label: "Family", icon: Users },
] as const;

export function PatientNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="sticky bottom-0 z-10 border-t border-border bg-card/95 px-2 py-2 backdrop-blur">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-6 w-6 ${active ? "stroke-[2.5]" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
