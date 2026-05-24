/**
 * DESIGN PHILOSOPHY: Holographic Glass — sticky glass header with subtle backdrop blur.
 * Now with auth-aware user menu (sign in / my prompts / submit / admin / sign out).
 */
import { useEffect, useState } from "react";
import { ChevronDown, Facebook, Languages, LogOut, ShieldCheck, Sparkles, Upload, User2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FACEBOOK_URL = "https://www.facebook.com/mrnghia45";

interface HeaderProps {
  onNavigate?: (section: "home" | "explore" | "submit" | "about") => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { t, lang, toggleLang } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (section: "home" | "explore" | "submit" | "about") => {
    // If we're on home page, scroll; otherwise navigate to home + section
    if (window.location.pathname !== "/") {
      setLocation("/");
      // wait for navigation then scroll
      setTimeout(() => onNavigate?.(section), 50);
      return;
    }
    onNavigate?.(section);
  };

  const isAdmin = user?.role === "admin";

  // Pending moderation count — only queried for admin viewers.
  const { data: pendingCount = 0 } = trpc.admin.pendingCount.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: 30_000,
  });

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-background/60 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-display font-bold text-base tracking-tight">
              PromptShare
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              by Mr. Nghĩa
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {(["home", "explore", "submit", "about"] as const).map((key) => (
            <button
              key={key}
              onClick={() => handleNav(key)}
              className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {t(`nav.${key}`)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className="h-9 px-3 flex items-center gap-1.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="font-mono">{lang === "en" ? "EN" : "VI"}</span>
          </button>

          {/* Auth area */}
          {!isAuthenticated ? (
            <a
              href={getLoginUrl()}
              className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <User2 className="w-3.5 h-3.5" />
              <span>{t("auth.login")}</span>
            </a>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 inline-flex items-center gap-2 pl-1.5 pr-2.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                  <span className="relative w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {(user?.name ?? "U").slice(0, 1).toUpperCase()}
                    {isAdmin && pendingCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold rounded-full bg-pink-400 text-background border border-background">
                        {pendingCount}
                      </span>
                    )}
                  </span>
                  <span className="max-w-[80px] truncate">{user?.name ?? "User"}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-white/10 bg-background/95 backdrop-blur-xl">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {t("auth.welcome")}, {user?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link href="/submit" className="cursor-pointer">
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    {t("auth.submit")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-prompts" className="cursor-pointer">
                    <User2 className="w-3.5 h-3.5 mr-2" />
                    {t("auth.my")}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer flex items-center justify-between gap-2 w-full">
                      <span className="flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2 text-cyan-300" />
                        <span className="text-cyan-300">{t("auth.admin")}</span>
                      </span>
                      {pendingCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-pink-400 text-background">
                          {pendingCount}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex group relative h-9 items-center gap-1.5 px-3.5 text-xs font-medium rounded-lg overflow-hidden transition-all duration-200 active:scale-[0.97]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/90 via-cyan-300/90 to-violet-400/90 opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-cyan-300 to-violet-300 blur-md" />
            <Facebook className="relative w-3.5 h-3.5 text-background" strokeWidth={2.5} />
            <span className="relative text-background font-semibold">Facebook</span>
          </a>
        </div>
      </div>
    </header>
  );
}
