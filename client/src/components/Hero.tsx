/**
 * DESIGN PHILOSOPHY: Holographic Glass — asymmetric hero with floating orb.
 */
import { ArrowRight, Facebook, Sparkles } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { PROMPTS, CATEGORIES } from "@/data/prompts";

const FACEBOOK_URL = "https://www.facebook.com/mrnghia45";
const ORB_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663483912510/J8fhT3n7JJ3sEzMHLJEy5Q/hero-orb-Kn94SvSNXdmtNfFgXsqJLc.webp";

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const { t } = useI18n();

  const stats = [
    { value: `${PROMPTS.length}+`, label: t("stats.prompts") },
    { value: "10+", label: t("stats.tools") },
    { value: "2", label: t("stats.languages") },
    { value: "$0", label: t("stats.cost") },
  ];

  return (
    <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-7 fade-up" style={{ animationDelay: "60ms" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              {t("hero.tag")}
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight">
              {t("hero.title1")}
              <br />
              <span className="text-gradient">{t("hero.title2")}</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onExplore}
                className="group relative inline-flex items-center gap-2 px-6 h-12 rounded-xl font-semibold text-sm text-background overflow-hidden active:scale-[0.97] transition-transform duration-150"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-200 to-pink-300 blur-lg" />
                <Sparkles className="relative w-4 h-4" strokeWidth={2.5} />
                <span className="relative">{t("hero.cta.explore")}</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl font-medium text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 active:scale-[0.97]"
              >
                <Facebook className="w-4 h-4" />
                {t("hero.cta.connect")}
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="fade-up"
                  style={{ animationDelay: `${200 + i * 80}ms` }}
                >
                  <div className="font-display font-bold text-2xl sm:text-3xl text-gradient">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Orb + floating chips */}
          <div className="lg:col-span-5 relative h-[340px] sm:h-[440px] lg:h-[520px] fade-up" style={{ animationDelay: "160ms" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[110%] h-[110%] rounded-full bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-pink-500/20 blur-3xl" />
              <img
                src={ORB_URL}
                alt=""
                className="relative w-full max-w-md object-contain animate-[auroraDrift1_18s_ease-in-out_infinite]"
                style={{ filter: "drop-shadow(0 0 60px oklch(0.78 0.16 200 / 0.35))" }}
              />
            </div>

            {/* Floating category chips */}
            {CATEGORIES.slice(0, 5).map((cat, idx) => {
              const positions = [
                { top: "8%", left: "5%" },
                { top: "18%", right: "8%" },
                { top: "55%", left: "-2%" },
                { bottom: "12%", right: "5%" },
                { bottom: "25%", left: "30%" },
              ];
              return (
                <div
                  key={cat.id}
                  className="absolute glass px-3 py-1.5 rounded-full text-xs font-medium fade-up"
                  style={{
                    ...positions[idx],
                    animationDelay: `${400 + idx * 100}ms`,
                  }}
                >
                  <span className="mr-1.5 text-cyan-300">{cat.emoji}</span>
                  {t("nav.home") === "Trang chủ" ? cat.vi : cat.en}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
