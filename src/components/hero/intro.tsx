import { profile } from "@/data/profile";
import { MonoLabel } from "@/components/ui/paper-bits";
import { scrollToSection } from "@/hooks/useActiveSection";

const rows = [
  { k: "Status", v: profile.status.toUpperCase(), dot: true },
  { k: "Focus", v: profile.focus.toUpperCase() },
  { k: "Location", v: "INDIA" },
  { k: "Build", v: profile.build },
];

export function Intro() {
  return (
    <div className="flex flex-col justify-center">
      <span className="mono-label inline-flex w-fit rounded-[3px] border border-border bg-paper px-3 py-1.5">
        // Who am I?
      </span>

      <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.03em] text-ink">
        {profile.name.toUpperCase()}
        <span className="text-primary">.</span>
      </h1>

      <p className="mt-5 max-w-[34ch] font-mono text-[15px] leading-relaxed text-primary/90 sm:text-base">
        {profile.tagline}
      </p>

      <dl className="mt-8 grid gap-2 rounded-[3px] border border-border bg-paper/80 p-4 shadow-[var(--shadow-paper)]">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex items-center justify-between gap-4 border-b border-dashed border-rule/50 pb-2 last:border-0 last:pb-0"
          >
            <dt className="mono-label">{r.k}</dt>
            <dd className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
              {r.v}
              {r.dot ? (
                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_oklch(0.7_0.15_150/0.18)]" />
              ) : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          onClick={() => scrollToSection("projects")}
          className="rounded-[3px] bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          View projects →
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          className="rounded-[3px] border border-ink/25 bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-primary hover:text-primary"
        >
          Get in touch
        </button>
      </div>

      <MonoLabel className="mt-6 block">
        System core / <span className="text-primary">active ◉</span>
      </MonoLabel>
    </div>
  );
}
