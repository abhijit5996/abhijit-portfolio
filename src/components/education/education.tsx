import { GraduationCap, ScrollText } from "lucide-react";
import { education, certifications } from "@/data/education";
import { Clip, MonoLabel, Tape } from "@/components/ui/paper-bits";

export function Education() {
  const { university, school } = education;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <article className="paper relative -rotate-[0.3deg] p-5 sm:p-7">
        <Tape className="-top-3 left-10 w-24 -rotate-2" />
        <Clip className="-right-2 -top-5 rotate-[10deg]" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <MonoLabel>Section / 06</MonoLabel>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Education
            </h2>
          </div>
          <MonoLabel>Academic record</MonoLabel>
        </div>

        <div className="mt-6 border-t border-dashed border-rule/70 pt-5">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[3px] border border-border bg-background text-primary">
              <GraduationCap className="size-4" strokeWidth={1.7} />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                {university.school}
              </h3>
              <p className="mt-1 font-mono text-[12px] text-muted-foreground">
                {university.degree} · {university.expected}
              </p>
              <p className="mt-1 font-mono text-[12px] text-primary">
                CGPA {university.cgpa}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <MonoLabel>Semester SGPA</MonoLabel>
            <ul className="mt-3 flex flex-wrap gap-2">
              {university.sgpa.map((v, i) => (
                <li
                  key={i}
                  className="rounded-[3px] border border-border bg-background px-2.5 py-1.5 font-mono text-[11px] text-ink"
                >
                  <span className="text-muted-foreground">S{i + 1}</span> {v.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-dashed border-rule/70 pt-5">
            <h3 className="font-display text-[15px] font-semibold text-ink">
              {school.name}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {school.marks.map((m) => (
                <li
                  key={m.label}
                  className="rounded-[3px] border border-border bg-background px-2.5 py-1.5 font-mono text-[11px] text-ink"
                >
                  <span className="text-muted-foreground">{m.label}</span> {m.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <article className="paper relative rotate-[0.6deg] p-5">
        <MonoLabel>Certifications</MonoLabel>
        <ul className="mt-4 space-y-4">
          {certifications.map((c) => (
            <li
              key={c.title}
              className="flex items-start gap-3 border-b border-dashed border-rule/60 pb-4 last:border-0 last:pb-0"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-[3px] border border-border bg-background text-primary">
                <ScrollText className="size-3.5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-display text-[14px] font-semibold leading-snug text-ink">
                  {c.title}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {c.issuer}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
