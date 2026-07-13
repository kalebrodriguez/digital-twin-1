import type { ReactNode } from "react";

export function PhoneFrame({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div
        className={`relative overflow-hidden rounded-[44px] border-8 ${
          tone === "dark" ? "border-neutral-900" : "border-neutral-200"
        } bg-background shadow-[0_30px_80px_-20px_oklch(0.5_0.05_250/0.35)]`}
      >
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-32 -translate-x-1/2 rounded-full bg-neutral-900" />
        <div className="min-h-[780px]">{children}</div>
      </div>
    </div>
  );
}
