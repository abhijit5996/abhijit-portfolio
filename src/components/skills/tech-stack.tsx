import { useState } from "react";
import { profile } from "@/data/profile";
import { skills, skillGroups, spokenLanguages } from "@/data/skills";
import { projects } from "@/data/projects";
import { Clip, MonoLabel, Tape } from "@/components/ui/paper-bits";

const titleById = new Map(projects.map((p) => [p.id, p.title]));

export function TechStack() {
  const [active, setActive] = useState<string | null>(null);
  const activeSkill = skills.find((s) => s.name === active);
  const linked = activeSkill?.projects ?? [];

  return (
    <div className="paper relative rotate-[0.3deg] p-5 sm:p-7">
      <Tape className="-top-3 left-10 w-24 -rotate-2" />
      <Clip className="-right-2 -top-5 rotate-[10deg]" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <MonoLabel>Section / 05</MonoLabel>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Technical Stack
          </h2>
        </div>
        <MonoLabel>How I build it</MonoLabel>
      </div>

      <div className="mt-6 space-y-5">
        {skillGroups.map((group) => (
          <div key={group} className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-4">
            <MonoLabel className="pt-2">{group}</MonoLabel>
            <ul className="flex flex-wrap gap-2 border-t border-dashed border-rule/60 pt-2">
              {skills
                .filter((s) => s.group === group)
                .map((s) => {
                  const isActive = active === s.name;
                  const dimmed = active !== null && !isActive;
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        onClick={() => setActive((curr) => (curr === s.name ? null : s.name))}
                        onMouseEnter={() => setActive(s.name)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(s.name)}
                        onBlur={() => setActive(null)}
                        aria-pressed={isActive}
                        className={[
                          "rounded-[3px] border px-2.5 py-1.5 font-mono text-[11px] transition-all",
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-ink hover:border-primary/50 hover:text-primary",
                          dimmed ? "opacity-45" : "opacity-100",
                        ].join(" ")}
                      >
                        {s.name}
                        {s.projects ? (
                          <span className="ml-1.5 text-[9px] text-muted-foreground">
                            {s.projects.length}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-7 min-h-[54px] rounded-[3px] border border-dashed border-rule/70 bg-secondary/40 p-3"
      >
        {activeSkill && linked.length > 0 ? (
          <p className="font-mono text-[12px] leading-relaxed text-ink">
            <span className="text-primary">{activeSkill.name}</span> →{" "}
            {linked.map((id) => titleById.get(id) ?? id).join(" · ")}
          </p>
        ) : (
          <p className="mono-label">
            Hover a technology to see where it&apos;s used
          </p>
        )}
      </div>

      <p className="mono-label mt-5 block border-t border-dashed border-rule/70 pt-3">
        Languages / {spokenLanguages.join(" · ")}
      </p>
    </div>
  );
}

export function CurrentFocus() {
  return (
    <div className="paper relative -rotate-[0.6deg] p-5">
      <MonoLabel>Current focus</MonoLabel>
      <ul className="mt-4 space-y-3">
        {profile.currentFocus.map((f) => (
          <li
            key={f}
            className="flex items-center gap-3 border-b border-dashed border-rule/60 pb-3 font-display text-[15px] text-ink last:border-0 last:pb-0"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {f}
          </li>
        ))}
      </ul>
      <div
        aria-hidden
        className="mt-6 grid size-20 place-items-center rounded-full border border-dashed border-primary/40 font-mono text-[9px] uppercase leading-tight tracking-[0.12em] text-primary"
      >
        keep
        <br />
        &lt;/&gt;
        <br />
        building
      </div>
    </div>
  );
}
