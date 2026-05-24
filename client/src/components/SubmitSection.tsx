/**
 * DESIGN PHILOSOPHY: Holographic Glass — invite users to share prompts via Facebook.
 */
import { Facebook, Send } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const FACEBOOK_URL = "https://www.facebook.com/mrnghia45";

export default function SubmitSection() {
  const { t } = useI18n();
  return (
    <section id="submit" className="relative pb-24">
      <div className="container">
        <div className="relative glass-strong rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16">
          {/* Aurora accent inside */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-400/20 to-violet-500/20 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-3 font-semibold">
                · 03 · Submit
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                {t("submit.title")}
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-lg">
                {t("submit.sub")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl font-semibold text-sm text-background overflow-hidden active:scale-[0.98] transition-transform"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-cyan-200 to-pink-300 blur-lg" />
                <Facebook className="relative w-5 h-5" strokeWidth={2.5} />
                <span className="relative">{t("submit.cta")}</span>
                <Send className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs text-muted-foreground font-mono hover:text-cyan-300 transition-colors"
              >
                facebook.com/mrnghia45
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
