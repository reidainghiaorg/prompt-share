/**
 * DESIGN PHILOSOPHY: Holographic Glass — invite users to share prompts.
 * If logged in → take them to /submit. If not → trigger login flow.
 */
import { Facebook, Send, Upload, User2 } from "lucide-react";
import { Link } from "wouter";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const FACEBOOK_URL = "https://www.facebook.com/mrnghia45";

export default function SubmitSection() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

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
              <p className="mt-3 text-xs text-muted-foreground/80 max-w-lg">
                {t("submit.form.sub")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  href="/submit"
                  className="group relative inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl font-semibold text-sm text-background overflow-hidden active:scale-[0.98] transition-transform"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-cyan-200 to-pink-300 blur-lg" />
                  <Upload className="relative w-5 h-5" strokeWidth={2.5} />
                  <span className="relative">{t("auth.submit")}</span>
                  <Send className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </Link>
              ) : (
                <a
                  href={getLoginUrl()}
                  className="group relative inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl font-semibold text-sm text-background overflow-hidden active:scale-[0.98] transition-transform"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-cyan-200 to-pink-300 blur-lg" />
                  <User2 className="relative w-5 h-5" strokeWidth={2.5} />
                  <span className="relative">{t("auth.login")}</span>
                </a>
              )}

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-xs text-muted-foreground font-medium border border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground transition-all"
              >
                <Facebook className="w-3.5 h-3.5" />
                {t("hero.cta.connect")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
