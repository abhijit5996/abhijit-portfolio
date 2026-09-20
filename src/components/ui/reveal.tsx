import { motion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  up: {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -26, rotate: -0.6 },
    show: { opacity: 1, x: 0, rotate: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 26, rotate: 0.6 },
    show: { opacity: 1, x: 0, rotate: 0 },
  },
  drop: {
    hidden: { opacity: 0, y: -18, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
} satisfies Record<string, Variants>;

export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: keyof typeof variants;
  delay?: number;
}) {
  // Fail-safe: if the in-view observer never fires (tall sections, restored
  // scroll position, reduced-motion quirks), force the content visible.
  const [forced, setForced] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForced(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      {...(forced ? { animate: "show" as const } : {})}
      viewport={{ once: true, amount: 0.1 }}
      variants={variants[from]}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
