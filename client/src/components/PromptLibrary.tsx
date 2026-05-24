/**
 * DESIGN PHILOSOPHY: Holographic Glass — main library with search, filters, masonry-ish grid.
 */
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import {
  CATEGORIES,
  PROMPTS,
  type AITool,
  type CategoryId,
  type PromptItem,
} from "@/data/prompts";
import { trpc } from "@/lib/trpc";
import PromptCard from "./PromptCard";

const ALL_TOOLS: AITool[] = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "Stable Diffusion",
  "DALL-E",
  "Sora",
  "Runway",
  "Suno",
  "GitHub Copilot",
];

type SortKey = "popular" | "newest" | "uses";

interface PromptLibraryProps {
  onView: (p: PromptItem) => void;
}

export default function PromptLibrary({ onView }: PromptLibraryProps) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [tool, setTool] = useState<AITool | "all">("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [showFilters, setShowFilters] = useState(false);

  const { data: communityRaw = [] } = trpc.prompts.listApproved.useQuery();

  // Map community prompts (from DB) into PromptItem shape used by the UI.
  const communityPrompts = useMemo<PromptItem[]>(() => {
    return communityRaw.map((c) => {
      const tools = (c.aiTools ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) as AITool[];
      const tags = (c.tags ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const createdAt = c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : "";
      return {
        id: `c${c.id}`,
        serverId: c.id,
        title: { en: c.titleEn, vi: c.titleVi || c.titleEn },
        description: {
          en: c.descriptionEn ?? "",
          vi: c.descriptionVi ?? c.descriptionEn ?? "",
        },
        prompt: {
          en: c.promptEn,
          vi: c.promptVi || c.promptEn,
        },
        category: (c.category as CategoryId) ?? "writing",
        tools: tools.length > 0 ? tools : ["ChatGPT"],
        tags,
        author: c.authorName ?? "Community",
        authorSlug: c.authorSlug ?? null,
        likes: Number(c.likeCount ?? 0),
        uses: Number(c.copyCount ?? 0),
        createdAt,
      } satisfies PromptItem;
    });
  }, [communityRaw]);

  const allPrompts = useMemo(
    () => [...communityPrompts, ...PROMPTS],
    [communityPrompts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allPrompts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (tool !== "all" && !p.tools.includes(tool)) return false;
      if (!q) return true;
      const hay = [
        p.title.en,
        p.title.vi,
        p.description.en,
        p.description.vi,
        p.prompt.en,
        p.prompt.vi,
        p.tags.join(" "),
        p.tools.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    if (sort === "popular") list = [...list].sort((a, b) => b.likes - a.likes);
    if (sort === "newest")
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "uses") list = [...list].sort((a, b) => b.uses - a.uses);
    return list;
  }, [allPrompts, query, category, tool, sort]);

  const hasActiveFilter = query !== "" || category !== "all" || tool !== "all";

  const clearAll = () => {
    setQuery("");
    setCategory("all");
    setTool("all");
  };

  return (
    <section id="library" className="relative pb-24">
      <div className="container">
        {/* Section header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2 font-semibold">
              · 02 ·
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              {t("section.library")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t("section.library.sub")}
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            {(["popular", "newest", "uses"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`px-3 h-9 text-xs font-medium rounded-lg border transition-all ${
                  sort === key
                    ? "bg-cyan-400/15 border-cyan-400/40 text-cyan-200"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
                }`}
              >
                {t(`sort.${key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Search + filter trigger */}
        <div className="glass rounded-2xl p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-black/20 border border-white/10 focus:border-cyan-400/40 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm placeholder:text-muted-foreground transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all ${
                showFilters || hasActiveFilter
                  ? "bg-violet-500/15 border-violet-400/30 text-violet-100"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t("filter.categories")}
              {hasActiveFilter && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-cyan-400 text-background">
                  {[category !== "all", tool !== "all", query !== ""].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                  {t("filter.categories")}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip
                    active={category === "all"}
                    onClick={() => setCategory("all")}
                    label={t("filter.all")}
                  />
                  {CATEGORIES.map((c) => (
                    <FilterChip
                      key={c.id}
                      active={category === c.id}
                      onClick={() => setCategory(c.id)}
                      label={`${c.emoji} ${c[lang]}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                  {t("filter.tools")}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip
                    active={tool === "all"}
                    onClick={() => setTool("all")}
                    label={t("filter.all")}
                  />
                  {ALL_TOOLS.map((tName) => (
                    <FilterChip
                      key={tName}
                      active={tool === tName}
                      onClick={() => setTool(tName)}
                      label={tName}
                      mono
                    />
                  ))}
                </div>
              </div>
              {hasActiveFilter && (
                <button
                  onClick={clearAll}
                  className="text-xs text-cyan-300 hover:text-cyan-200 font-medium inline-flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> {t("filter.clear")}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3 opacity-50">◯</div>
            <h3 className="font-display font-semibold text-lg mb-1">
              {t("empty.title")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("empty.sub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, idx) => (
              <PromptCard key={p.id} prompt={p} index={idx} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  mono,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  mono?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 h-8 text-xs rounded-lg border transition-all active:scale-95 ${
        mono ? "font-mono" : "font-medium"
      } ${
        active
          ? "bg-cyan-400/15 border-cyan-400/40 text-cyan-100"
          : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}
