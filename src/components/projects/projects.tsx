import { useEffect, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { projects as staticProjects, type Project } from "@/data/projects";
import { getPublishedProjects } from "@/lib/api/projects";
import { trackEvent } from "@/lib/api/analytics";
import { Clip, MonoLabel, SectionHeading, Tape } from "@/components/ui/paper-bits";
import { Reveal } from "@/components/ui/reveal";

function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-primary/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
      <span className="size-1.5 animate-pulse rounded-full bg-primary" />
      {status}
    </span>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={project.repo}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => void trackEvent("github_click", { projectId: project.id })}
        aria-label={`${project.title} source on GitHub`}
        className="grid size-8 place-items-center rounded-[3px] border border-border text-ink transition-colors hover:border-primary hover:text-primary"
      >
        <Github className="size-3.5" />
      </a>
      {project.live ? (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => void trackEvent("live_demo_click", { projectId: project.id })}
          className="group/cta inline-flex items-center gap-1.5 rounded-[3px] border border-primary/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Live demo
          <ArrowUpRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </a>
      ) : (
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => void trackEvent("github_click", { projectId: project.id })}
          className="group/cta inline-flex items-center gap-1.5 rounded-[3px] border border-ink/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-primary hover:text-primary"
        >
          Source
          <ArrowUpRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}

function FeatureSheet({ project }: { project: Project }) {
  return (
    <article className="paper paper-lift group relative -rotate-[0.4deg] p-4 sm:p-6">
      <Tape className="-top-3 left-10 w-24 -rotate-2" />
      <Clip className="-left-2 top-8 rotate-[6deg]" />

      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-rule/70 pb-3">
        <MonoLabel>Flagship / {project.index}</MonoLabel>
        <StatusBadge status={project.status} />
      </header>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="overflow-hidden border border-border bg-secondary/50">
          <img
            src={project.image}
            alt={project.imageAlt}
            width={1024}
            height={640}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-[0.03em] text-ink">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
            {project.subtitle}
          </p>
          <p className="mt-3 font-mono text-[13px] leading-relaxed text-muted-foreground">
            {project.summary}
          </p>

          <ul className="mt-4 space-y-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-3 font-mono text-[12.5px] leading-relaxed text-foreground/85"
              >
                <span aria-hidden className="text-primary">
                  ▸
                </span>
                {h}
              </li>
            ))}
          </ul>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-[3px] border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-dashed border-rule/70 pt-4">
            <Links project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectSheet({ project, i }: { project: Project; i: number }) {
  const tilt = [-0.7, 0.5, -0.3][i % 3] ?? 0;

  return (
    <article
      className="paper paper-lift group relative flex h-full flex-col p-4"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {i === 1 ? <Tape amber className="-top-3 left-10 w-20 rotate-3" /> : null}
      {i !== 1 ? <Tape className="-top-3 left-8 w-20 -rotate-2" /> : null}

      <header className="flex items-center justify-between gap-2 border-b border-dashed border-rule/70 pb-3">
        <MonoLabel>Project / {project.index}</MonoLabel>
        <StatusBadge status={project.status} />
      </header>

      <div className="mt-4 overflow-hidden border border-border bg-secondary/50">
        <img
          src={project.image}
          alt={project.imageAlt}
          width={1024}
          height={640}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-display text-lg font-semibold uppercase tracking-[0.04em] text-ink">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          {project.subtitle}
        </p>
        <p className="mt-2 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <ul className="mt-2 max-h-0 space-y-1.5 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2 font-mono text-[12px] leading-relaxed text-foreground/80">
              <span aria-hidden className="text-primary">
                ▸
              </span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <li
            key={s}
            className="rounded-[3px] border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
          >
            {s}
          </li>
        ))}
      </ul>

      <footer className="mt-4 flex items-center justify-between gap-2 border-t border-dashed border-rule/70 pt-3">
        <MonoLabel>Repo</MonoLabel>
        <Links project={project} />
      </footer>
    </article>
  );
}

export function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(staticProjects);

  useEffect(() => {
    void getPublishedProjects().then((data) => {
      if (data && data.length > 0) {
        setProjectList(data);
      }
    });
  }, []);

  const featured = projectList.filter((p) => p.featured);
  const rest = projectList.filter((p) => !p.featured);

  return (
    <div className="paper relative p-5 sm:p-8">
      <Tape className="-top-3 left-1/3 w-28 rotate-1" />
      <SectionHeading index="Section / 03" title="Projects" hint="What I've built" />

      <div className="mt-8 space-y-6">
        {featured.map((p, i) => (
          <Reveal key={p.id} from="up" delay={i * 0.06}>
            <FeatureSheet project={p} />
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {rest.map((p, i) => (
          <Reveal key={p.id} from="up" delay={i * 0.06} className="h-full">
            <ProjectSheet project={p} i={i} />
          </Reveal>
        ))}
      </div>

      <a
        href="https://github.com/abhijit5996?tab=repositories"
        target="_blank"
        rel="noreferrer noopener"
        className="mono-label link-underline mt-8 inline-flex items-center gap-2 text-ink"
      >
        View all repositories on GitHub →
      </a>
    </div>
  );
}
