/**
 * DESIGN PHILOSOPHY: Holographic Glass — Futuristic Minimalism
 * Main page composing all sections of PromptShare.
 */
import { useState } from "react";
import AuroraBackground from "@/components/AuroraBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromptLibrary from "@/components/PromptLibrary";
import PromptModal from "@/components/PromptModal";
import SubmitSection from "@/components/SubmitSection";
import AboutSection, { Footer } from "@/components/AboutSection";
import { type PromptItem } from "@/data/prompts";

export default function Home() {
  const [selected, setSelected] = useState<PromptItem | null>(null);

  const scrollTo = (section: "home" | "explore" | "submit" | "about") => {
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const id = section === "explore" ? "library" : section;
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuroraBackground />
      <Header onNavigate={scrollTo} />
      <main className="flex-1">
        <Hero onExplore={() => scrollTo("explore")} />
        <PromptLibrary onView={setSelected} />
        <SubmitSection />
        <AboutSection />
      </main>
      <Footer />
      <PromptModal prompt={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
