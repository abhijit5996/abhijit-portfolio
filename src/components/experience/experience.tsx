import { experience } from "@/data/experience";
import { MonoLabel, SectionHeading } from "@/components/ui/paper-bits";
import { Reveal } from "@/components/ui/reveal";

export function Experience() {
  return (
    <div>
      <SectionHeading index="Section / 04" title="Experience" hint="Where I've applied it" />

      <ol className="mt-8 border-l border-dashed border-rule pl-6 sm:pl-10">
        {experience.map((e, i) => (
          <li key={e.org + e.role} className="relative pb-10 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[1.68rem] top-2 size-3 rounded-full border border-primary bg-background sm:-left-[2.68rem]"
            />
            <Reveal from="right" delay={i * 0.06}>
              <article className="paper paper-lift p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold uppercase tracking-[0.05em] text-ink">
                    {e.org}
                    <span className="ml-2 font-mono text-[11px] font-normal tracking-[0.14em] text-muted-foreground">
                      — {e.orgNote}
                    </span>
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-primary/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                    <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                    {e.status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 border-y border-dashed border-rule/70 py-3 sm:grid-cols-2">
                  <div>
                    <MonoLabel>Role</MonoLabel>
                    <dd className="mt-1 font-mono text-[12.5px] text-ink">{e.role}</dd>
                  </div>
                  <div>
                    <MonoLabel>Domain</MonoLabel>
                    <dd className="mt-1 font-mono text-[12.5px] text-ink">{e.domain}</dd>
                  </div>
                </dl>

                <ul className="mt-4 space-y-2">
                  {e.points.map((p) => (
                    <li
                      key={p}
                      className="flex gap-3 font-mono text-[12.5px] leading-relaxed text-foreground/85"
                    >
                      <span aria-hidden className="text-primary">
                        ▸
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-dashed border-rule/70 pt-3">
                  {e.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-[3px] border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
