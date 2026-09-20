export function StickyNote() {
  return (
    <aside className="note-paper relative rotate-[1.6deg] p-5 font-mono text-sm leading-8 text-ink">
      <span aria-hidden className="tape tape-amber absolute -top-3 left-8 w-20 -rotate-6" />
      <p>
        Code.
        <br />
        Build.
        <br />
        Deploy.
        <br />
        Repeat.
      </p>
    </aside>
  );
}

export function ExploringNote() {
  return (
    <aside className="paper relative -rotate-[1.2deg] p-4">
      <p className="mono-label">Currently exploring</p>
      <p className="mt-2 font-display text-lg font-semibold text-ink">AI × Web × Cloud</p>
      <p className="mono-label mt-3 block border-t border-dashed border-rule/70 pt-2">
        System status / curious · building · learning
      </p>
    </aside>
  );
}
