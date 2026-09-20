import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tape({
  className,
  amber = false,
}: {
  className?: string;
  amber?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn("tape", amber && "tape-amber", "w-24 rounded-[1px]", className)}
    />
  );
}

export function Clip({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 56"
      className={cn("pointer-events-none absolute h-14 w-6 text-rule", className)}
      fill="none"
    >
      <path
        d="M17 10v30a5 5 0 0 1-10 0V12a8 8 0 0 1 16 0v30a13 13 0 0 1-26 0V14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Pin({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute size-3 rounded-full bg-primary/80 shadow-[0_2px_4px_rgba(0,0,0,0.25)] ring-2 ring-paper",
        className,
      )}
    />
  );
}

export function MonoLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("mono-label", className)}>{children}</span>;
}

export function SectionHeading({
  index,
  title,
  hint,
  className,
}: {
  index: string;
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <MonoLabel>{index}</MonoLabel>
        <h2 className="mt-1 text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
      </div>
      {hint ? <MonoLabel className="pb-1">{hint}</MonoLabel> : null}
    </div>
  );
}
