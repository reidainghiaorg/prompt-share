/**
 * MyPrompts page: shows a member's submissions with status badges.
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Clock, Loader2, Upload, XCircle } from "lucide-react";

import AuroraBackground from "@/components/AuroraBackground";
import Header from "@/components/Header";
import { Footer } from "@/components/AboutSection";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function MyPromptsPage() {
  const { t, lang } = useI18n();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  const { data = [], isLoading } = trpc.prompts.mine.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuroraBackground />
      <Header />
      <main className="flex-1 relative">
        <div className="container max-w-5xl py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t("nav.home")}
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2 font-semibold">
                · {t("auth.my")} ·
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
                {t("my.title")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">{t("my.sub")}</p>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold text-background bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400 active:scale-[0.98] transition-transform"
            >
              <Upload className="w-3.5 h-3.5" /> {t("auth.submit")}
            </Link>
          </div>

          {isLoading ? (
            <div className="glass rounded-2xl p-12 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
            </div>
          ) : data.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-5xl mb-3 opacity-50">◯</div>
              <h3 className="font-display font-semibold text-lg mb-1">{t("my.empty")}</h3>
              <Link
                href="/submit"
                className="inline-flex items-center gap-1.5 mt-4 text-xs text-cyan-300 hover:text-cyan-200"
              >
                <Upload className="w-3.5 h-3.5" /> {t("auth.submit")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((p) => {
                const title = lang === "vi" && p.titleVi ? p.titleVi : p.titleEn;
                return (
                  <div
                    key={p.id}
                    className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 group hover:border-white/20 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-base mb-1 truncate">
                        {title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-mono uppercase tracking-wider">
                          {p.category}
                        </span>
                        <span>·</span>
                        <span className="font-mono">{p.aiTools}</span>
                        <span>·</span>
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                      {p.status === "rejected" && p.rejectionReason && (
                        <p className="mt-2 text-[11px] text-pink-300/80 italic">
                          “{p.rejectionReason}”
                        </p>
                      )}
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const { t } = useI18n();
  const map = {
    pending: {
      icon: Clock,
      cls: "bg-amber-400/10 border-amber-400/30 text-amber-200",
      label: t("status.pending"),
    },
    approved: {
      icon: CheckCircle2,
      cls: "bg-emerald-400/10 border-emerald-400/30 text-emerald-200",
      label: t("status.approved"),
    },
    rejected: {
      icon: XCircle,
      cls: "bg-pink-400/10 border-pink-400/30 text-pink-200",
      label: t("status.rejected"),
    },
  } as const;
  const { icon: Icon, cls, label } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 h-7 text-[11px] font-medium rounded-full border ${cls} whitespace-nowrap`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
