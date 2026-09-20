import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { trackEvent } from "@/lib/api/analytics";

import { Navbar } from "@/components/navigation/navbar";
import { BlueprintBackground } from "@/components/layout/blueprint-background";
import { Footer } from "@/components/layout/footer";
import { ProfileDocument } from "@/components/profile/profile-document";
import { Intro } from "@/components/hero/intro";
import { Capabilities } from "@/components/capabilities/capabilities";
import { EngineeringSystem } from "@/components/system/engineering-system";
import { About } from "@/components/about/about";
import { ExploringNote, StickyNote } from "@/components/ui/notes";
import { Terminal } from "@/components/terminal/terminal";
import { Projects } from "@/components/projects/projects";
import { Experience } from "@/components/experience/experience";
import { CurrentFocus, TechStack } from "@/components/skills/tech-stack";
import { Education } from "@/components/education/education";
import { Contact } from "@/components/contact/contact";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const title = "Abhijit Das — Web Developer & AI/ML Engineer Portfolio";
const description =
  "Portfolio of Abhijit Das: full-stack web developer and AI/ML enthusiast building intelligent systems, developer tools and cloud-ready products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useSmoothScroll();

  useEffect(() => {
    void trackEvent("page_view", { pagePath: "/" });
  }, []);

  return (
    <>
      <BlueprintBackground />
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6">
        {/* HERO */}
        <section id="home" className="scroll-mt-20 pt-10 sm:pt-14">
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)_300px] xl:grid-cols-[330px_minmax(0,1fr)_330px]">
            <Reveal from="left">
              <ProfileDocument />
            </Reveal>
            <Reveal from="up" delay={0.08}>
              <Intro />
            </Reveal>
            <Reveal from="right" delay={0.14}>
              <Capabilities />
            </Reveal>
          </div>

          <div className="mt-14 grid items-center gap-8 lg:grid-cols-[260px_minmax(0,1fr)_300px] xl:grid-cols-[300px_minmax(0,1fr)_330px]">
            <Reveal from="left" className="order-2 lg:order-1">
              <div className="space-y-6">
                <div id="about" className="scroll-mt-24">
                  <About />
                </div>
                <StickyNote />
              </div>
            </Reveal>

            <Reveal from="fade" delay={0.1} className="order-1 lg:order-2">
              <EngineeringSystem />
            </Reveal>

            <Reveal from="right" delay={0.12} className="order-3">
              <div className="space-y-6">
                <ExploringNote />
                <Terminal />
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-20 pt-20">
          <Projects />
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="scroll-mt-20 pt-20">
          <Experience />
        </section>

        {/* SKILLS */}
        <section id="skills" className="scroll-mt-20 pt-20">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <Reveal from="left">
              <CurrentFocus />
            </Reveal>
            <Reveal from="up" delay={0.08}>
              <TechStack />
            </Reveal>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="scroll-mt-20 pt-20">
          <Reveal from="up">
            <Education />
          </Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-20 pt-20">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Reveal from="up">
              <Contact />
            </Reveal>
            <Reveal from="right" delay={0.08}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
