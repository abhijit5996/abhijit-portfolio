import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { Clip, MonoLabel } from "@/components/ui/paper-bits";

export function About() {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = expanded ? profile.about : profile.about.slice(0, 2);

  return (
    <article className="paper relative -rotate-[0.4deg] p-5 sm:p-6">
      <Clip className="-right-2 -top-5 -rotate-[10deg]" />
      <header className="flex items-center justify-between border-b border-dashed border-rule/70 pb-3">
        <MonoLabel>About me</MonoLabel>
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-rule" />
          <span className="size-2 rounded-full bg-rule" />
          <span className="size-2 rounded-full bg-primary/60" />
        </span>
      </header>

      <div className="mt-4 space-y-4 font-mono text-[13px] leading-[1.85] text-foreground">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="group mt-6 inline-flex items-center gap-2 rounded-[3px] border border-primary/40 bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {expanded ? "Read less" : "Read more"}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
      </button>
    </article>
  );
}
