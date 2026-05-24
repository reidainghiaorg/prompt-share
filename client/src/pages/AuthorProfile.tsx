/**
 * DESIGN PHILOSOPHY: Holographic Glass — public author profile page.
 *
 * Shows the author's display name, role badge, join date, bio, and aggregate
 * stats (total approved prompts / likes / copies). The grid below reuses the
 * same `PromptCard` from the library so the experience feels consistent. When
 * the viewer is also the author, a small inline editor lets them update the bio
 * without leaving the page.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  ArrowLeft,
  Copy as CopyIcon,
  Heart,
  Loader2,
  Pencil,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import AuroraBackground from "@/components/AuroraBackground";
import Header from "@/components/Header";
import { Footer } from "@/components/AboutSection";
import PromptCard from "@/components/PromptCard";
import PromptModal from "@/components/PromptModal";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { type AITool, type CategoryId, type PromptItem } from "@/data/prompts";

export default function AuthorProfile() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [, setLocation] = useLocation();
  const { lang, t } = useI18n();
  const { user: viewer } = useAuth();
  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.users.profileBySlug.useQuery(
    { slug },
    { enabled: slug.length > 0 }
  );

  const [selected, setSelected] = useState<PromptItem | null>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");

  // Hydrate the bio draft whenever the underlying data resolves.
  useEffect(() => {
    setBioDraft(data?.author.bio ?? "");
  }, [data?.author.bio]);

  const updateBio = trpc.auth.updateBio.useMutation({
    onSuccess: () => {
      toast.success(t("profile.saveBio"));
      setEditingBio(false);
      utils.users.profileBySlug.invalidate({ slug });
    },
    onError: (e) => toast.error(e.message),
  });

  const promptItems = useMemo<PromptItem[]>(() => {
    if (!data) return [];
    return data.prompts.map((c) => {
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
        author: data.author.name ?? "Community",
        authorSlug: data.author.slug ?? null,
        likes: Number(c.likeCount ?? 0),
        uses: Number(c.copyCount ?? 0),
        createdAt,
      } satisfies PromptItem;
    });
  }, [data]);

  const isOwner = viewer?.id != null && data?.author.id === viewer.id;
  const isAdmin = data?.author.role === "admin";

  const joinedLabel = data?.author.joinedAt
    ? new Date(data.author.joinedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      <AuroraBackground />
      <Header />
      <main className="flex-1 pb-24">
        <div className="container max-w-5xl py-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-3 h-3" />
            {t("profile.back")}
          </Link>

          {/* Loading */}
          {isLoading && (
            <div className="glass rounded-2xl p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          )}

          {/* Not found */}
          {error && !isLoading && (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-5xl mb-3 opacity-50">◯</div>
              <h3 className="font-display font-semibold text-lg mb-1">
                {t("profile.notFound")}
              </h3>
              <p className="text-sm text-muted-foreground">/u/{slug}</p>
              <button
                onClick={() => setLocation("/")}
                className="mt-4 text-xs text-cyan-300 hover:text-cyan-200 font-medium"
              >
                {t("profile.back")}
              </button>
            </div>
          )}

          {/* Author header */}
          {data && (
            <>
              <section className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
                {/* Aurora top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-400" />

                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 blur-xl opacity-50" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
                      {(data.author.name ?? "U").slice(0, 1).toUpperCase()}
                    </div>
                  </div>

                  {/* Identity */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
                        {data.author.name ?? "Anonymous"}
                      </h1>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-cyan-400/15 border border-cyan-400/30 text-cyan-200">
                          <ShieldCheck className="w-3 h-3" />
                          {t("profile.curator")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      @{data.author.slug} ·{" "}
                      {isAdmin ? t("profile.curator") : t("profile.member")}
                      {joinedLabel && (
                        <>
                          {" · "}
                          {t("profile.joined")} {joinedLabel}
                        </>
                      )}
                    </p>

                    {/* Bio (view + edit) */}
                    <div className="mt-4">
                      {editingBio ? (
                        <div className="space-y-2">
                          <Textarea
                            value={bioDraft}
                            onChange={(e) => setBioDraft(e.target.value.slice(0, 280))}
                            placeholder={t("profile.bioPlaceholder")}
                            className="bg-black/30 border-white/10 text-sm min-h-[80px]"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              disabled={updateBio.isPending}
                              onClick={() => updateBio.mutate({ bio: bioDraft })}
                              className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-md bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-100 border border-cyan-400/30 transition-all active:scale-95 disabled:opacity-60"
                            >
                              {updateBio.isPending && (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              )}
                              {t("profile.saveBio")}
                            </button>
                            <button
                              onClick={() => {
                                setEditingBio(false);
                                setBioDraft(data.author.bio ?? "");
                              }}
                              className="h-8 px-3 text-xs rounded-md text-muted-foreground hover:bg-white/5"
                            >
                              ✕
                            </button>
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {bioDraft.length}/280
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                            {data.author.bio ||
                              (isOwner
                                ? t("profile.bioPlaceholder")
                                : t("profile.member"))}
                          </p>
                          {isOwner && (
                            <button
                              onClick={() => setEditingBio(true)}
                              className="h-7 px-2 inline-flex items-center gap-1 text-[11px] rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
                            >
                              <Pencil className="w-3 h-3" />
                              {t("profile.editBio")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <StatCard
                    icon={<Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
                    label={t("profile.totalPrompts")}
                    value={data.stats.totalPrompts}
                  />
                  <StatCard
                    icon={<Heart className="w-3.5 h-3.5 text-pink-300" />}
                    label={t("profile.totalLikes")}
                    value={data.stats.totalLikes}
                  />
                  <StatCard
                    icon={<CopyIcon className="w-3.5 h-3.5 text-violet-300" />}
                    label={t("profile.totalCopies")}
                    value={data.stats.totalCopies}
                  />
                </div>
              </section>

              {/* Prompts grid */}
              <section className="mt-10">
                <h2 className="font-display font-semibold text-xl mb-4">
                  {t("section.library")}
                </h2>
                {promptItems.length === 0 ? (
                  <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
                    {t("profile.empty")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {promptItems.map((p, idx) => (
                      <PromptCard key={p.id} prompt={p} index={idx} onView={setSelected} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
      <PromptModal prompt={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="glass rounded-xl p-3.5 border border-white/5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
        {icon}
        {label}
      </div>
      <div className="font-display font-bold text-2xl tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
