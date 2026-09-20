export function BlueprintBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-70"
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="bp-fine" width="112" height="112" patternUnits="userSpaceOnUse">
            <path
              d="M112 0H0v112"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/10"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-fine)" />
        <line
          x1="4%"
          y1="0"
          x2="4%"
          y2="100%"
          className="stroke-primary/15"
          strokeDasharray="6 8"
        />
        <line
          x1="96%"
          y1="0"
          x2="96%"
          y2="100%"
          className="stroke-primary/15"
          strokeDasharray="6 8"
        />
      </svg>

      <div className="absolute left-4 top-24 hidden select-none flex-col gap-40 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/50 lg:flex">
        <span>X—001</span>
        <span>X—002</span>
        <span>X—003</span>
        <span>X—004</span>
        <span>X—005</span>
      </div>

      <svg
        className="absolute right-6 top-1/3 hidden h-40 w-40 text-primary/15 lg:block"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeDasharray="3 5" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" />
        <path d="M50 0v100M0 50h100" stroke="currentColor" strokeDasharray="2 6" />
      </svg>
    </div>
  );
}
