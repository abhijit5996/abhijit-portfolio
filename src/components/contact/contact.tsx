import { Github, Globe, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { social } from "@/data/social";
import { MonoLabel, Tape } from "@/components/ui/paper-bits";

const iconMap = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  pin: MapPin,
} as const;

export function Contact() {
  return (
    <div className="paper relative -rotate-[0.3deg] p-5 sm:p-7">
      <Tape amber className="-top-3 right-12 w-24 rotate-2" />

      <MonoLabel>Section / 07</MonoLabel>
      <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Let&apos;s connect
      </h2>
      <p className="mt-3 max-w-[52ch] font-mono text-[13px] leading-relaxed text-muted-foreground">
        Open to internships, freelance builds and collaborations across web, AI and cloud.
        The fastest way to reach me is email.
      </p>

      <ul className="mt-6 space-y-3">
        {social.map((s) => {
          const Icon = iconMap[s.icon];
          return (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                className="group flex items-center gap-3 border-b border-dashed border-rule/60 pb-3 font-mono text-[13px] text-ink"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-[3px] border border-border bg-background text-primary transition-colors group-hover:border-primary/50">
                  <Icon className="size-3.5" strokeWidth={1.7} />
                </span>
                <span className="link-underline break-all">{s.value}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <a
        href={social[0]?.href ?? "#"}
        className="group mt-7 inline-flex items-center gap-2 rounded-[3px] bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        Let&apos;s talk
        <Send className="size-3.5 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}
