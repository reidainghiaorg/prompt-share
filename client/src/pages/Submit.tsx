/**
 * Submit page: authenticated members fill out a form and the prompt enters
 * the moderation queue (status = "pending").
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import AuroraBackground from "@/components/AuroraBackground";
import Header from "@/components/Header";
import { Footer } from "@/components/AboutSection";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

const CATEGORIES = [
  { id: "writing", en: "Writing", vi: "Viết lách" },
  { id: "coding", en: "Coding", vi: "Lập trình" },
  { id: "image", en: "Image", vi: "Hình ảnh" },
  { id: "video", en: "Video", vi: "Video" },
  { id: "music", en: "Music", vi: "Âm nhạc" },
  { id: "marketing", en: "Marketing", vi: "Tiếp thị" },
  { id: "business", en: "Business", vi: "Kinh doanh" },
  { id: "education", en: "Education", vi: "Giáo dục" },
  { id: "research", en: "Research", vi: "Nghiên cứu" },
  { id: "lifestyle", en: "Lifestyle", vi: "Đời sống" },
] as const;

const AI_TOOLS = [
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
  "Cursor",
  "Other",
] as const;

export default function SubmitPage() {
  const { t, lang } = useI18n();
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const [titleEn, setTitleEn] = useState("");
  const [titleVi, setTitleVi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descVi, setDescVi] = useState("");
  const [promptEn, setPromptEn] = useState("");
  const [promptVi, setPromptVi] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]["id"]>("writing");
  const [tools, setTools] = useState<string[]>([]);
  const [tags, setTags] = useState("");

  // Redirect to login if not signed in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  const submitMutation = trpc.prompts.submit.useMutation({
    onSuccess: () => {
      toast.success(t("submit.success"));
      utils.prompts.mine.invalidate();
      utils.prompts.listApproved.invalidate();
      setLocation("/my-prompts");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const toggleTool = (name: string) => {
    setTools((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const canSubmit =
    titleEn.trim().length >= 3 &&
    promptEn.trim().length >= 10 &&
    tools.length >= 1 &&
    !submitMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error(t("submit.field.required"));
      return;
    }
    submitMutation.mutate({
      titleEn: titleEn.trim(),
      titleVi: titleVi.trim() || null,
      descriptionEn: descEn.trim() || null,
      descriptionVi: descVi.trim() || null,
      promptEn: promptEn.trim(),
      promptVi: promptVi.trim() || null,
      category,
      aiTools: tools,
      tags: tags.trim() || null,
    });
  };

  if (loading || !isAuthenticated) {
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
        <div className="container max-w-4xl py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t("nav.home")}
          </Link>

          <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2 font-semibold inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> · {t("auth.submit")} ·
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-2">
            {t("submit.form.title")}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mb-8">
            {t("submit.form.sub")}
          </p>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Titles */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("submit.field.titleEn")}>
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  required
                  maxLength={200}
                  className={inputCls}
                  placeholder="Expert SEO Blog Writer"
                />
              </Field>
              <Field label={t("submit.field.titleVi")}>
                <input
                  value={titleVi}
                  onChange={(e) => setTitleVi(e.target.value)}
                  maxLength={200}
                  className={inputCls}
                  placeholder="Chuyên gia viết blog SEO"
                />
              </Field>
            </div>

            {/* Descriptions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("submit.field.descEn")}>
                <textarea
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  className={textareaCls}
                  placeholder="Short summary of what the prompt does..."
                />
              </Field>
              <Field label={t("submit.field.descVi")}>
                <textarea
                  value={descVi}
                  onChange={(e) => setDescVi(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  className={textareaCls}
                  placeholder="Tóm tắt ngắn về prompt..."
                />
              </Field>
            </div>

            {/* Prompt bodies */}
            <Field label={t("submit.field.promptEn")}>
              <textarea
                value={promptEn}
                onChange={(e) => setPromptEn(e.target.value)}
                required
                minLength={10}
                maxLength={8000}
                rows={6}
                className={textareaCls}
                placeholder="Act as an expert..."
              />
            </Field>

            <Field label={t("submit.field.promptVi")}>
              <textarea
                value={promptVi}
                onChange={(e) => setPromptVi(e.target.value)}
                maxLength={8000}
                rows={6}
                className={textareaCls}
                placeholder="Đóng vai chuyên gia..."
              />
            </Field>

            {/* Category */}
            <Field label={t("submit.field.category")}>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`px-3 h-8 text-xs rounded-lg border transition-all ${
                      category === c.id
                        ? "bg-cyan-400/15 border-cyan-400/40 text-cyan-100"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    {c[lang]}
                  </button>
                ))}
              </div>
            </Field>

            {/* AI tools */}
            <Field label={t("submit.field.aiTools")}>
              <div className="flex flex-wrap gap-1.5">
                {AI_TOOLS.map((name) => {
                  const active = tools.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleTool(name)}
                      className={`px-3 h-8 text-xs font-mono rounded-lg border transition-all ${
                        active
                          ? "bg-violet-500/15 border-violet-400/40 text-violet-100"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Tags */}
            <Field label={t("submit.field.tags")}>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                maxLength={255}
                className={inputCls}
                placeholder="seo, blog, content"
              />
            </Field>

            <button
              type="submit"
              disabled={!canSubmit}
              className="group relative inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold text-sm text-background overflow-hidden active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400" />
              {submitMutation.isPending ? (
                <Loader2 className="relative w-4 h-4 animate-spin" />
              ) : (
                <Send className="relative w-4 h-4" />
              )}
              <span className="relative">{t("submit.button")}</span>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const inputCls =
  "w-full h-11 px-3.5 rounded-xl bg-black/20 border border-white/10 focus:border-cyan-400/40 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm placeholder:text-muted-foreground transition-all";
const textareaCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:border-cyan-400/40 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm placeholder:text-muted-foreground transition-all font-mono leading-relaxed resize-y";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}
