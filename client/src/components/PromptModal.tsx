/**
 * DESIGN PHILOSOPHY: Holographic Glass — large glass modal with prompt details.
 */
import { useState } from "react";
import { Check, Copy, Heart, Tag, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { useI18n, type Lang } from "@/contexts/I18nContext";
import { CATEGORIES, type PromptItem } from "@/data/prompts";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  useIncrementCopy,
  useLikedPromptIds,
  useToggleLike,
} from "@/hooks/usePromptEngagement";

interface PromptModalProps {
  prompt: PromptItem | null;
  onClose: () => void;
}

export default function PromptModal({ prompt, onClose }: PromptModalProps) {
  const { lang, t } = useI18n();
  const { isAuthenticated } = useAuth();
  const likedSet = useLikedPromptIds();
  const toggleLike = useToggleLike();
  const incrementCopy = useIncrementCopy();
  const [copiedLang, setCopiedLang] = useState<Lang | null>(null);

  if (!prompt) return null;

  const category = CATEGORIES.find((c) => c.id === prompt.category);
  const isCommunity = typeof prompt.serverId === "number";
  const liked = isCommunity ? likedSet.has(prompt.serverId!) : false;

  const handleCopy = async (l: Lang) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt[l]);
      setCopiedLang(l);
      toast.success(t("card.copied"), {
        description: l === "en" ? "English version" : "Phiên bản Tiếng Việt",
      });
      setTimeout(() => setCopiedLang(null), 2000);
      if (isCommunity) {
        incrementCopy.mutate({ promptId: prompt.serverId! });
      }
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleLike = () => {
    if (!isCommunity) {
      toast.info(t("like.loginFirst"));
      return;
    }
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    toggleLike.mutate({ promptId: prompt.serverId! });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto glass-strong rounded-t-3xl sm:rounded-2xl border border-white/10 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Aurora accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-400 rounded-t-3xl sm:rounded-t-2xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 pr-12">
            <div className="flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground">
                <span className="text-cyan-300">{category?.emoji}</span>
                {category?.[lang]}
              </div>
              <button
                onClick={handleLike}
                aria-pressed={liked}
                className={`inline-flex items-center gap-1 px-2 h-7 rounded-md border text-xs font-medium transition-all active:scale-95 ${
                  liked
                    ? "bg-pink-500/15 border-pink-400/40 text-pink-200"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-pink-200 hover:border-pink-400/30 hover:bg-pink-500/10"
                }`}
              >
                <Heart className={`w-3 h-3 ${liked ? "fill-pink-400 text-pink-400" : ""}`} />
                {prompt.likes.toLocaleString()}
              </button>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="w-3 h-3 text-cyan-400/70" />
                {prompt.uses.toLocaleString()} {t("card.copies")}
              </div>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight">
              {prompt.title[lang]}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("modal.author")}{" "}
              {prompt.authorSlug ? (
                <Link
                  href={`/u/${prompt.authorSlug}`}
                  onClick={onClose}
                  className="text-cyan-300 hover:text-cyan-200 font-medium"
                >
                  {prompt.author}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{prompt.author}</span>
              )}
            </p>
          </div>

          {/* Description */}
          <section className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
              {t("modal.description")}
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {prompt.description[lang]}
            </p>
          </section>

          {/* Tools */}
          <section className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
              {t("modal.tools")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {prompt.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 text-xs rounded-md bg-violet-500/10 border border-violet-400/20 text-violet-200 font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>

          {/* Prompt — English */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                <span className="font-mono text-cyan-300">EN</span>
                {t("modal.prompt")}
              </h3>
              <button
                onClick={() => handleCopy("en")}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-md bg-white/5 hover:bg-cyan-400/20 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/30 transition-all active:scale-95"
              >
                {copiedLang === "en" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedLang === "en" ? t("card.copied") : t("modal.copy.en")}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-black/30 border border-white/5 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
              {prompt.prompt.en}
            </pre>
          </section>

          {/* Prompt — Vietnamese */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                <span className="font-mono text-pink-300">VI</span>
                {t("modal.prompt")}
              </h3>
              <button
                onClick={() => handleCopy("vi")}
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-md bg-white/5 hover:bg-pink-400/20 hover:text-pink-200 border border-white/10 hover:border-pink-400/30 transition-all active:scale-95"
              >
                {copiedLang === "vi" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedLang === "vi" ? t("card.copied") : t("modal.copy.vi")}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-black/30 border border-white/5 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
              {prompt.prompt.vi}
            </pre>
          </section>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {t("modal.tags")}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 border border-white/10 text-muted-foreground font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
