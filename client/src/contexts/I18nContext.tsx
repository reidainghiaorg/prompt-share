/**
 * DESIGN PHILOSOPHY: Holographic Glass — Futuristic Minimalism
 * Bilingual i18n (English / Vietnamese) with persistence.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "vi";

type Dict = Record<string, { en: string; vi: string }>;

const dict: Dict = {
  "nav.home": { en: "Home", vi: "Trang chủ" },
  "nav.explore": { en: "Explore", vi: "Khám phá" },
  "nav.submit": { en: "Submit", vi: "Đóng góp" },
  "nav.about": { en: "About", vi: "Giới thiệu" },

  "hero.tag": { en: "Free · Open · Bilingual", vi: "Miễn phí · Mở · Song ngữ" },
  "hero.title1": { en: "Prompts that", vi: "Prompt đánh thức" },
  "hero.title2": { en: "unlock AI's true power", vi: "sức mạnh thật của AI" },
  "hero.subtitle": {
    en: "A free, curated library of high-quality prompts for ChatGPT, Midjourney, Sora, Suno and every AI tool you love — in English and Vietnamese.",
    vi: "Thư viện prompt chất lượng cao, hoàn toàn miễn phí, dành cho ChatGPT, Midjourney, Sora, Suno và mọi công cụ AI bạn yêu thích — song ngữ Anh & Việt.",
  },
  "hero.cta.explore": { en: "Explore prompts", vi: "Khám phá prompt" },
  "hero.cta.connect": { en: "Connect on Facebook", vi: "Kết nối Facebook" },

  "stats.prompts": { en: "Curated prompts", vi: "Prompt tuyển chọn" },
  "stats.tools": { en: "AI tools covered", vi: "Công cụ AI hỗ trợ" },
  "stats.languages": { en: "Languages", vi: "Ngôn ngữ" },
  "stats.cost": { en: "Cost — forever", vi: "Chi phí — mãi mãi" },

  "section.library": { en: "The Library", vi: "Thư viện" },
  "section.library.sub": {
    en: "Search, filter and copy. Everything you see is free to use.",
    vi: "Tìm, lọc và copy. Tất cả đều miễn phí sử dụng.",
  },

  "search.placeholder": {
    en: "Search prompts, tags or AI tools...",
    vi: "Tìm prompt, tag hoặc công cụ AI...",
  },

  "filter.all": { en: "All", vi: "Tất cả" },
  "filter.categories": { en: "Categories", vi: "Danh mục" },
  "filter.tools": { en: "AI Tools", vi: "Công cụ AI" },
  "filter.clear": { en: "Clear filters", vi: "Xóa bộ lọc" },

  "card.copy": { en: "Copy", vi: "Copy" },
  "card.copied": { en: "Copied!", vi: "Đã copy!" },
  "card.view": { en: "View", vi: "Xem" },
  "card.uses": { en: "uses", vi: "lượt dùng" },

  "modal.prompt": { en: "Prompt", vi: "Prompt" },
  "modal.description": { en: "Description", vi: "Mô tả" },
  "modal.tools": { en: "Compatible tools", vi: "Công cụ tương thích" },
  "modal.tags": { en: "Tags", vi: "Thẻ" },
  "modal.copy.en": { en: "Copy English", vi: "Copy Tiếng Anh" },
  "modal.copy.vi": { en: "Copy Vietnamese", vi: "Copy Tiếng Việt" },
  "modal.author": { en: "by", vi: "bởi" },

  "empty.title": { en: "No prompts found", vi: "Không tìm thấy prompt" },
  "empty.sub": {
    en: "Try removing filters or searching with different keywords.",
    vi: "Thử bỏ bộ lọc hoặc tìm với từ khóa khác.",
  },

  "submit.title": { en: "Share your prompt", vi: "Chia sẻ prompt của bạn" },
  "submit.sub": {
    en: "Have a prompt that deserves the spotlight? Send it through and we'll feature the best ones.",
    vi: "Bạn có prompt đáng được giới thiệu? Gửi cho chúng tôi, các prompt hay nhất sẽ được lên trang.",
  },
  "submit.cta": { en: "Send via Facebook", vi: "Gửi qua Facebook" },

  "about.title": { en: "Built for the community", vi: "Xây dựng cho cộng đồng" },
  "about.body": {
    en: "PromptShare is a personal, free initiative by Mr. Nghĩa to help Vietnamese and global users get more from AI. No paywalls, no logins. Just copy and create.",
    vi: "PromptShare là dự án cá nhân, hoàn toàn miễn phí của Mr. Nghĩa nhằm giúp người dùng Việt Nam và quốc tế khai thác AI hiệu quả hơn. Không paywall, không cần đăng nhập. Chỉ cần copy và sáng tạo.",
  },

  "footer.tagline": {
    en: "Crafted with curiosity. Powered by community.",
    vi: "Tạo bằng sự tò mò. Được tiếp sức bởi cộng đồng.",
  },
  "footer.follow": { en: "Follow Mr. Nghĩa", vi: "Theo dõi Mr. Nghĩa" },
  "footer.rights": { en: "All prompts are free to use", vi: "Mọi prompt đều miễn phí sử dụng" },

  "lang.toggle": { en: "VI", vi: "EN" },
  "sort.popular": { en: "Most popular", vi: "Phổ biến nhất" },
  "sort.newest": { en: "Newest", vi: "Mới nhất" },
  "sort.uses": { en: "Most used", vi: "Dùng nhiều nhất" },
};

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict | string) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "vi";
    const stored = localStorage.getItem("promptshare-lang") as Lang | null;
    if (stored === "en" || stored === "vi") return stored;
    const browser = navigator.language.toLowerCase();
    return browser.startsWith("vi") ? "vi" : "en";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("promptshare-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState((p) => (p === "en" ? "vi" : "en"));

  const t = (key: string) => {
    const entry = (dict as Dict)[key];
    if (!entry) return key;
    return entry[lang];
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
