import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ShieldAlert } from "lucide-react";
import { PatientNav } from "./PatientNav";
import { PhoneFrame } from "./PhoneFrame";

export function PatientShell({
  title,
  children,
  showBack = false,
  showEmergency = true,
}: {
  title?: string;
  children: ReactNode;
  showBack?: boolean;
  showEmergency?: boolean;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="min-h-dvh bg-gradient-to-b from-accent/40 via-background to-background px-4 py-8">
      <div className="mx-auto mb-4 flex max-w-[400px] items-center justify-between text-sm text-muted-foreground">
        <span className="font-semibold">Patient view</span>
        <Link to="/caregiver" className="rounded-full border border-border bg-card px-3 py-1 font-semibold hover:bg-accent">
          Switch to Caregiver →
        </Link>
      </div>
      <PhoneFrame>
        <div className="flex min-h-[780px] flex-col">
          {title && (
            <header className="flex items-center gap-3 px-6 pt-12 pb-2">
              {showBack && pathname !== "/" && (
                <Link to="/" className="-ml-2 rounded-full p-2 text-muted-foreground hover:bg-accent">
                  <ChevronLeft className="h-6 w-6" />
                </Link>
              )}
              <h1 className="font-display text-2xl font-semibold">{title}</h1>
            </header>
          )}
          <main className="flex-1 px-6 pb-6 pt-2">{children}</main>
          {showEmergency && (
            <div className="px-6 pb-3">
              <Link
                to="/emergency"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-4 text-lg font-bold text-destructive-foreground shadow-[0_10px_30px_-10px_oklch(0.65_0.19_25/0.6)] active:scale-[0.98]"
              >
                <ShieldAlert className="h-6 w-6" />
                Emergency
              </Link>
            </div>
          )}
          <PatientNav />
        </div>
      </PhoneFrame>
    </div>
  );
}
