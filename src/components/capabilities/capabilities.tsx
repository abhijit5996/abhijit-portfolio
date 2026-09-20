import { Boxes, Cloud, Cpu } from "lucide-react";
import { profile } from "@/data/profile";
import { Tape } from "@/components/ui/paper-bits";

const icons = [Boxes, Cpu, Cloud];

export function Capabilities() {
  return (
    <article className="paper ruled-paper relative rotate-[0.6deg] p-5 sm:p-6">
      <Tape amber className="-top-3 right-8 w-24 rotate-2" />
      <span
        aria-hidden
        className="absolute left-3 top-6 flex h-[calc(100%-3rem)] flex-col justify-between"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="block size-2 rounded-full border border-rule bg-background" />
        ))}
      </span>

      <div className="pl-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg font-semibold uppercase tracking-[0.08em] text-ink underline decoration-primary decoration-2 underline-offset-8">
            What I Build
          </h2>
          <span className="font-mono text-sm text-primary">&lt;/&gt;</span>
        </div>

        <ul className="mt-6 space-y-5">
          {profile.pillars.map((p, i) => {
            const Icon = icons[i] ?? Boxes;
            return (
              <li key={p.title} className="group flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[3px] border border-border bg-background text-primary transition-colors group-hover:border-primary/50">
                  <Icon className="size-3.5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {p.index}
                  </p>
                  <p className="font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-ink">
                    {p.title}
                  </p>
                  <p className="mt-1 font-mono text-[12px] leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mono-label mt-8 block border-t border-dashed border-rule/70 pt-3">
          Always learning
        </p>
      </div>
    </article>
  );
}
