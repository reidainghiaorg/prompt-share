/**
 * Admin moderation page: visible to admins only. Lists pending submissions
 * with approve / reject buttons. Approving moves the prompt to public library.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import AuroraBackground from "@/components/AuroraBackground";
import Header from "@/components/Header";
import { Footer } from "@/components/AboutSection";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function AdminPage() {
  const { t } = useI18n();
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  const isAdmin = user?.role === "admin";
  const { data = [], isLoading } = trpc.admin.listPending.useQuery(undefined, {
    enabled: isAdmin,
  });

  const approveMut = trpc.admin.approve.useMutation({
    onSuccess: () => {
      toast.success("Approved");
      utils.admin.listPending.invalidate();
      utils.admin.pendingCount.invalidate();
      utils.prompts.listApproved.invalidate();
    },
  });

  const rejectMut = trpc.admin.reject.useMutation({
    onSuccess: () => {
      toast.success("Rejected");
      utils.admin.listPending.invalidate();
      utils.admin.pendingCount.invalidate();
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <AuroraBackground />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="glass rounded-2xl p-12 text-center max-w-md">
            <ShieldCheck className="w-10 h-10 text-pink-300/70 mx-auto mb-3" />
            <h2 className="font-display font-semibold text-xl mb-2">Admin only</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This page is restricted to the project owner.
            </p>
            <Link href="/" className="text-xs text-cyan-300 hover:text-cyan-200">
              ← {t("nav.home")}
            </Link>
          </div>
        </main>
        <Footer />
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
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2 font-semibold inline-flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> · {t("auth.admin")} ·
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
                {t("admin.title")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                {t("admin.sub")}
              </p>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center">
              <div className="font-display font-bold text-2xl bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                {data.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Pending
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="glass rounded-2xl p-12 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
            </div>
          ) : data.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Check className="w-10 h-10 text-emerald-300/70 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-lg mb-1">
                {t("admin.empty")}
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((p) => (
                <PendingCard
                  key={p.id}
                  item={p}
                  onApprove={(id) => approveMut.mutate({ id })}
                  onReject={(id, reason) => rejectMut.mutate({ id, reason })}
                  isWorking={approveMut.isPending || rejectMut.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface PendingItem {
  id: number;
  titleEn: string;
  titleVi: string | null;
  descriptionEn: string | null;
  descriptionVi: string | null;
  promptEn: string;
  promptVi: string | null;
  category: string;
  aiTools: string;
  tags: string | null;
  createdAt: Date;
  authorName: string | null;
}

function PendingCard({
  item,
  onApprove,
  onReject,
  isWorking,
}: {
  item: PendingItem;
  onApprove: (id: number) => void;
  onReject: (id: number, reason?: string) => void;
  isWorking: boolean;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base sm:text-lg mb-1">
            {item.titleEn}
          </h3>
          {item.titleVi && (
            <p className="text-xs text-muted-foreground italic mb-2">{item.titleVi}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10">
              {item.category}
            </span>
            <span className="font-mono">{item.aiTools}</span>
            <span>·</span>
            <span>
              {t("admin.by")} <span className="text-cyan-300">{item.authorName ?? "—"}</span>
            </span>
            <span>·</span>
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            disabled={isWorking}
            onClick={() => onApprove(item.id)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold bg-emerald-400/15 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/25 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" /> {t("admin.approve")}
          </button>
          <button
            disabled={isWorking}
            onClick={() => setShowRejectForm((v) => !v)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold bg-pink-400/10 border border-pink-400/30 text-pink-200 hover:bg-pink-400/20 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" /> {t("admin.reject")}
          </button>
        </div>
      </div>

      {showRejectForm && (
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("admin.rejectReason")}
            className="flex-1 h-10 px-3 rounded-lg bg-black/20 border border-white/10 focus:border-pink-400/40 focus:outline-none text-sm"
          />
          <button
            onClick={() => {
              onReject(item.id, reason.trim() || undefined);
              setShowRejectForm(false);
              setReason("");
            }}
            className="h-10 px-4 rounded-lg text-xs font-semibold bg-pink-400/20 border border-pink-400/40 text-pink-200 hover:bg-pink-400/30"
          >
            {t("admin.reject")}
          </button>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Hide" : "Preview"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 text-sm">
          {item.descriptionEn && (
            <p className="text-muted-foreground">{item.descriptionEn}</p>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-cyan-300 mb-1 font-semibold">
              Prompt (EN)
            </div>
            <pre className="whitespace-pre-wrap text-xs font-mono bg-black/30 border border-white/5 rounded-lg p-3 max-h-60 overflow-auto">
              {item.promptEn}
            </pre>
          </div>
          {item.promptVi && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-cyan-300 mb-1 font-semibold">
                Prompt (VI)
              </div>
              <pre className="whitespace-pre-wrap text-xs font-mono bg-black/30 border border-white/5 rounded-lg p-3 max-h-60 overflow-auto">
                {item.promptVi}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
