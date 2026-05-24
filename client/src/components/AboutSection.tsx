/**
 * DESIGN PHILOSOPHY: Holographic Glass — minimal about & footer.
 */
import { Facebook, Heart, Sparkles } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const FACEBOOK_URL = "https://www.facebook.com/mrnghia45";

export default function AboutSection() {
  const { t } = useI18n();
  return (
    <section id="about" className="relative pb-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-3 font-semibold">
              · 04 · About
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight leading-tight">
              {t("about.title")}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("about.body")}
            </p>
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/30 text-sm font-medium transition-all active:scale-[0.97]"
              >
                <Facebook className="w-4 h-4 text-cyan-300" />
                {t("footer.follow")}
              </a>
              <span className="text-xs font-mono text-muted-foreground">
                facebook.com/mrnghia45
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative border-t border-white/5 mt-12">
      <div className="container py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 blur-md opacity-50" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-sm">PromptShare</div>
              <div className="text-[11px] text-muted-foreground">
                {t("footer.tagline")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("footer.rights")}</span>
            <Heart className="w-3 h-3 text-pink-400/70 fill-pink-400/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
