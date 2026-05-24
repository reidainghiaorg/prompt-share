/**
 * DESIGN PHILOSOPHY: Holographic Glass — sticky glass header with subtle backdrop blur.
 */
import { useEffect, useState } from "react";
import { Facebook, Languages, Sparkles } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const FACEBOOK_URL = "https://www.facebook.com/mrnghia45";

interface HeaderProps {
  onNavigate: (section: "home" | "explore" | "submit" | "about") => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { t, lang, toggleLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-background/60 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-display font-bold text-base tracking-tight">
              PromptShare
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              by Mr. Nghĩa
            </span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {(["home", "explore", "submit", "about"] as const).map((key) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {t(`nav.${key}`)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className="h-9 px-3 flex items-center gap-1.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="font-mono">{lang === "en" ? "EN" : "VI"}</span>
          </button>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-medium rounded-lg overflow-hidden transition-all duration-200 active:scale-[0.97]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/90 via-cyan-300/90 to-violet-400/90 opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-cyan-300 to-violet-300 blur-md" />
            <Facebook className="relative w-3.5 h-3.5 text-background" strokeWidth={2.5} />
            <span className="relative text-background font-semibold">Facebook</span>
          </a>
        </div>
      </div>
    </header>
  );
}
