import { Brain, Boxes, Cloud, Code2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MonoLabel } from "@/components/ui/paper-bits";

type Node = {
  id: string;
  title: string;
  icon: LucideIcon;
  items: readonly string[];
};

const nodes: Record<"top" | "left" | "right" | "bottom", Node> = {
  top: {
    id: "N-01",
    title: "AI / ML",
    icon: Brain,
    items: ["LLMs", "AI Agents", "Automation", "RAG & AI Search"],
  },
  left: {
    id: "N-02",
    title: "Web Development",
    icon: Code2,
    items: ["React / Next.js", "TypeScript", "Node.js", "Modern UI/UX"],
  },
  right: {
    id: "N-03",
    title: "Cloud & DevOps",
    icon: Cloud,
    items: ["Azure", "Docker", "CI/CD", "Monitoring"],
  },
  bottom: {
    id: "N-04",
    title: "Real World Solutions",
    icon: Boxes,
    items: ["Scalable Apps", "Automation", "Better Systems", "Real Impact"],
  },
};

function NodeCard({ node }: { node: Node }) {
  const Icon = node.icon;
  return (
    <div className="relative rounded-[3px] border border-border bg-paper/90 p-2.5 @[620px]:p-3">
      <div className="flex items-center gap-2 border-b border-dashed border-rule/60 pb-2">
        <span aria-hidden className="size-1.5 rounded-full bg-primary/70" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
          {node.title}
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[0.14em] text-rule">
          {node.id}
        </span>
      </div>
      <div className="mt-2 flex items-start gap-3">
        <span className="hidden size-9 shrink-0 place-items-center rounded-[3px] border border-border text-primary @[620px]:grid">
          <Icon className="size-4" strokeWidth={1.6} />
        </span>
        <ul className="space-y-0.5">
          {node.items.map((it) => (
            <li
              key={it}
              className="font-mono text-[10.5px] leading-relaxed text-muted-foreground"
            >
              <span aria-hidden className="mr-1.5 text-rule">
                ·
              </span>
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StageLabel({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary ${className ?? ""}`}
    >
      {label}
      <span aria-hidden className="size-1.5 rounded-full bg-primary/70" />
    </span>
  );
}

export function EngineeringSystem() {
  return (
    <div className="@container relative w-full">
      {/* Header */}
      <div className="relative text-center">
        <MonoLabel>System / ABH-001</MonoLabel>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Engineering System
        </h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          Web <span className="text-rule">×</span> AI <span className="text-rule">×</span>{" "}
          Cloud <span className="text-rule">×</span> Impact
        </p>
      </div>

      {/* Coordinate annotations */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-2 hidden border-l border-rule/60 pl-2 font-mono text-[9px] leading-relaxed tracking-[0.1em] text-rule @[720px]:block"
      >
        <div>22.6520° N</div>
        <div>88.4300° E</div>
        <div>// LOC</div>
        <div>GLOBAL</div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-2 hidden border-r border-rule/60 pr-2 text-right font-mono text-[9px] leading-relaxed tracking-[0.1em] text-rule @[720px]:block"
      >
        <div>v2.7</div>
        <div>BUILDING</div>
        <div>A BETTER</div>
        <div className="text-primary/70">TOMORROW</div>
      </div>

      {/* Diagram */}
      <div className="relative mt-8">
        {/* dashed orbit + corner marks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-6 hidden rounded-full border border-dashed border-primary/25 @[500px]:block"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 size-3 border-l border-t border-primary/40"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 size-3 border-r border-t border-primary/40"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 size-3 border-b border-l border-primary/40"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 size-3 border-b border-r border-primary/40"
        />

        <div className="grid gap-4 p-4 @[500px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)] @[500px]:items-center @[500px]:gap-x-5 @[500px]:gap-y-6">
          {/* Row 1 */}
          <StageLabel
            label="Idea"
            className="hidden @[500px]:col-start-1 @[500px]:flex @[500px]:self-end"
          />
          <div className="@[500px]:col-start-2">
            <NodeCard node={nodes.top} />
          </div>
          <StageLabel
            label="Plan"
            className="hidden @[500px]:col-start-3 @[500px]:flex @[500px]:justify-end @[500px]:self-end"
          />

          {/* connector */}
          <span
            aria-hidden
            className="hidden @[500px]:col-start-2 @[500px]:-my-3 @[500px]:mx-auto @[500px]:block @[500px]:h-6 @[500px]:w-px @[500px]:bg-primary/40"
          />

          {/* Row 2 */}
          <div className="@[500px]:col-start-1">
            <NodeCard node={nodes.left} />
          </div>
          <div className="relative rounded-[3px] border border-primary/45 bg-background p-5 text-center @[500px]:col-start-2">
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-1.5 rounded-[4px] border border-dashed border-primary/25"
            />
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              Abhijit Das
            </p>
            <div className="mt-2 space-y-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <p>Developer</p>
              <p>AI Enthusiast</p>
              <p>Problem Solver</p>
            </div>
          </div>
          <div className="@[500px]:col-start-3">
            <NodeCard node={nodes.right} />
          </div>

          {/* connector */}
          <span
            aria-hidden
            className="hidden @[500px]:col-start-2 @[500px]:-my-3 @[500px]:mx-auto @[500px]:block @[500px]:h-6 @[500px]:w-px @[500px]:bg-primary/40"
          />

          {/* Row 3 */}
          <StageLabel
            label="Deploy"
            className="hidden @[500px]:col-start-1 @[500px]:flex @[500px]:self-start"
          />
          <div className="@[500px]:col-start-2">
            <NodeCard node={nodes.bottom} />
          </div>
          <StageLabel
            label="Code"
            className="hidden @[500px]:col-start-3 @[500px]:flex @[500px]:justify-end @[500px]:self-start"
          />
        </div>

        {/* Impact footer */}
        <div className="mt-2 flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-10 bg-rule/70" />
          <StageLabel label="Impact" />
          <span aria-hidden className="h-px w-10 bg-rule/70" />
        </div>
      </div>

      {/* Footer annotations */}
      <div
        aria-hidden
        className="mt-6 hidden items-start justify-between gap-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-rule @[720px]:flex"
      >
        <div className="border-t border-rule/60 pt-2">
          <div>People</div>
          <div>Ideas</div>
          <div>Technology</div>
          <div>Impact</div>
        </div>
        <div className="border-t border-rule/60 pt-2 text-right">
          <div>Continuous</div>
          <div>Learning</div>
          <div>Continuous</div>
          <div>Building</div>
        </div>
      </div>

      {/* Mobile pipeline */}
      <ul className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 @[500px]:hidden">
        {["Idea", "Plan", "Code", "Deploy", "Impact"].map((s) => (
          <li
            key={s}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
