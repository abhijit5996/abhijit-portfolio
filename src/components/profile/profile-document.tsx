import portrait from "@/assets/profile.jpg";
import { profile } from "@/data/profile";
import { Clip, MonoLabel, Tape } from "@/components/ui/paper-bits";

function Barcode() {
  const bars = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 4, 2, 1];
  return (
    <div aria-hidden className="flex h-6 items-end gap-[2px]">
      {bars.map((w, i) => (
        <span
          key={i}
          className="block h-full bg-ink/80"
          style={{ width: `${w}px`, opacity: i % 3 === 0 ? 0.55 : 0.9 }}
        />
      ))}
    </div>
  );
}

function QrMark() {
  const cells = Array.from({ length: 49 }, (_, i) => (i * 7 + (i % 5)) % 3 !== 0);
  return (
    <div aria-hidden className="grid size-14 grid-cols-7 gap-[1px] bg-ink/10 p-[1px]">
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-ink/85" : "bg-paper"} />
      ))}
    </div>
  );
}

export function ProfileDocument() {
  return (
    <article className="paper paper-lift relative -rotate-[0.7deg] p-4 sm:p-5">
      <Tape className="-top-3 left-6 w-28 -rotate-3" />
      <Clip className="-left-2 -top-5 rotate-[8deg]" />

      <header className="flex items-center justify-between border-b border-dashed border-rule/70 pb-3">
        <MonoLabel>Engineer Profile</MonoLabel>
        <Barcode />
      </header>

      <div className="mt-4 border border-border bg-secondary/60 p-1.5">
        <img
          src={portrait}
          alt="Portrait of Abhijit Das"
          width={768}
          height={896}
          className="aspect-[4/5] w-full object-cover grayscale-[15%]"
        />
      </div>

      <div className="mt-5">
        <h2 className="font-display text-2xl font-bold tracking-[0.02em] text-ink">
          {profile.name.toUpperCase()}
        </h2>
        <p className="mt-1 font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
          {profile.roles[0]}
          <br />
          {profile.roles[1]}
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <MonoLabel>ID: {profile.id}</MonoLabel>
          <p
            aria-hidden
            className="mt-3 font-display text-xl italic text-ink/70"
            style={{ fontStyle: "italic", transform: "rotate(-3deg)" }}
          >
            Abhijit Das
          </p>
        </div>
        <QrMark />
      </div>

      <div className="mt-5 h-2 w-full bg-[repeating-linear-gradient(45deg,var(--color-rule)_0_6px,transparent_6px_12px)] opacity-50" />
    </article>
  );
}
