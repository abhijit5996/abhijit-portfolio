import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { social } from "@/data/social";

type Line = { kind: "in" | "out"; text: string };

const help = [
  "available commands:",
  "  whoami      identity",
  "  about       short bio",
  "  skills      technologies",
  "  projects    selected work",
  "  experience  engineering record",
  "  contact     how to reach me",
  "  help        this list",
  "  clear       reset the session",
];

function run(cmd: string): string[] {
  switch (cmd) {
    case "whoami":
      return [profile.name, profile.roles.join(" · "), profile.location];
    case "about":
      return [profile.about[0] ?? ""];
    case "skills":
      return [skills.map((s) => s.name).join(", ")];
    case "projects":
      return projects.map((p) => `[${p.index}] ${p.title} — ${p.summary}`);
    case "experience":
      return experience.map((e) => `[${e.status}] ${e.org} — ${e.role}`);
    case "contact":
      return social.map((s) => `${s.label.padEnd(9)} ${s.value}`);
    case "help":
      return help;
    case "":
      return [];
    default:
      return [`command not found: ${cmd}`, "type 'help' for available commands"];
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "in", text: "whoami" },
    { kind: "out", text: profile.name },
    { kind: "out", text: "type 'help' to explore" },
  ]);
  const [value, setValue] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = value.trim().toLowerCase();
    setValue("");
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    setLines((prev) => [
      ...prev,
      { kind: "in", text: cmd },
      ...run(cmd).map((text) => ({ kind: "out" as const, text })),
    ]);
  };

  return (
    <div className="paper relative rotate-[0.5deg] p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="mono-label">Terminal</span>
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-rule" />
          <span className="size-2 rounded-full bg-rule" />
          <span className="size-2 rounded-full bg-rule" />
        </span>
      </div>

      <div
        className="cursor-text rounded-[3px] bg-terminal p-4"
        onClick={() => input.current?.focus()}
      >
        <div
          ref={scroller}
          className="h-56 overflow-y-auto font-mono text-[12.5px] leading-relaxed text-terminal-foreground"
          role="log"
          aria-live="polite"
        >
          {lines.map((l, i) => (
            <p key={i} className={l.kind === "in" ? "text-terminal-foreground" : "text-emerald-300/90"}>
              {l.kind === "in" ? <span className="text-primary-foreground/60">$ </span> : null}
              <span className="whitespace-pre-wrap">{l.text}</span>
            </p>
          ))}
        </div>

        <form onSubmit={submit} className="mt-2 flex items-center gap-2">
          <label htmlFor="terminal-input" className="font-mono text-sm text-terminal-foreground/60">
            $
          </label>
          <input
            id="terminal-input"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="help"
            aria-label="Terminal command input"
            className="w-full bg-transparent font-mono text-[12.5px] text-terminal-foreground outline-none placeholder:text-terminal-foreground/30"
          />
        </form>
      </div>
    </div>
  );
}
