import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navSections } from "@/data/social";
import { profile } from "@/data/profile";
import { useActiveSection, scrollToSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const ids = navSections.map((s) => s.id);

export function Navbar() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6"
      >
        <button
          onClick={() => go("home")}
          className="flex items-center gap-3 text-left"
          aria-label="Back to top"
        >
          <span className="grid size-9 place-items-center rounded-[3px] border border-ink/70 bg-paper font-mono text-sm font-bold tracking-tight text-ink">
            {profile.initials}
          </span>
          <span className="hidden sm:block">
            <span className="font-display text-sm font-semibold tracking-[0.12em] text-ink">
              {profile.name.toUpperCase()}
            </span>
            <span className="mono-label ml-2">/ Portfolio</span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {navSections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                  active === s.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-ink",
                )}
              >
                {s.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-300",
                    active === s.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <button
            onClick={() => go("contact")}
            className="rounded-[3px] border border-primary/40 bg-primary px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Let&apos;s talk
          </button>
        </div>

        <button
          className="grid size-10 place-items-center rounded-[3px] border border-border bg-paper md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="mx-auto max-w-[1400px] px-4 py-3">
            {navSections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  className="w-full border-b border-dashed border-rule/60 py-3 text-left font-mono text-xs uppercase tracking-[0.18em] text-ink"
                >
                  {s.label}
                </button>
              </li>
            ))}
            <li className="pt-4">
              <button
                onClick={() => go("contact")}
                className="w-full rounded-[3px] bg-primary px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground"
              >
                Let&apos;s talk →
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
