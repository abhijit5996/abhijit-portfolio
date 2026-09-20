import { profile } from "@/data/profile";
import { scrollToSection } from "@/hooks/useActiveSection";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-dashed border-rule/70 py-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
        <p className="mono-label">
          © {new Date().getFullYear()} {profile.name} — designed & built in India
        </p>
        <button onClick={() => scrollToSection("home")} className="mono-label link-underline">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
