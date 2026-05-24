/**
 * DESIGN PHILOSOPHY: Holographic Glass — glass card with glow on hover.
 */
import { useState } from "react";
import { Check, Copy, Eye, Heart, Zap } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";
import { CATEGORIES, type PromptItem } from "@/data/prompts";

interface PromptCardProps {
  prompt: PromptItem;
  index: number;
  onView: (p: PromptItem) => void;
}

export default function PromptCard({ prompt, index, onView }: PromptCardProps) {
  const { lang, t } = useI18n();
  const [copied, setCopied] = useState(false);

  const category = CATEGORIES.find((c) => c.id === prompt.category);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt[lang]);
      setCopied(true);
      toast.success(t("card.copied"), {
        description: prompt.title[lang],
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <article
      className="group relative fade-up"
      style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
    >
      <div
        onClick={() => onView(prompt)}
        className="relative h-full glass rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:border-cyan-300/30 hover:translate-y-[-2px] hover:shadow-[0_12px_40px_oklch(0.78_0.16_200/0.15)]"
      >
        {/* Glow accent */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-violet-500/5" />
        </div>

        {/* Header: category + tools */}
        <div className="relative flex items-start justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-muted-foreground">
            <span className="text-cyan-300">{category?.emoji}</span>
            {category?.[lang]}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Heart className="w-3 h-3 text-pink-400/70" />
            {prompt.likes.toLocaleString()}
          </div>
        </div>

        {/* Title & description */}
        <h3 className="relative font-display font-semibold text-lg leading-snug mb-2 group-hover:text-gradient transition-colors">
          {prompt.title[lang]}
        </h3>
        <p className="relative text-sm text-muted-foreground line-clamp-2 mb-4">
          {prompt.description[lang]}
        </p>

        {/* Prompt preview */}
        <div className="relative mb-4 p-3 rounded-lg bg-black/20 border border-white/5">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
            {prompt.prompt[lang]}
          </p>
        </div>

        {/* Tools chips */}
        <div className="relative flex flex-wrap gap-1.5 mb-4">
          {prompt.tools.slice(0, 3).map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 text-[10px] rounded-md bg-violet-500/10 border border-violet-400/20 text-violet-200 font-mono"
            >
              {tool}
            </span>
          ))}
          {prompt.tools.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 border border-white/10 text-muted-foreground">
              +{prompt.tools.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Zap className="w-3 h-3 text-cyan-400/70" />
            {prompt.uses.toLocaleString()} {t("card.uses")}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(prompt);
              }}
              className="h-7 px-2.5 inline-flex items-center gap-1 text-[11px] rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Eye className="w-3 h-3" />
              {t("card.view")}
            </button>
            <button
              onClick={handleCopy}
              className="h-7 px-2.5 inline-flex items-center gap-1 text-[11px] font-medium rounded-md bg-white/10 hover:bg-cyan-400/20 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/30 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  {t("card.copied")}
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  {t("card.copy")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
