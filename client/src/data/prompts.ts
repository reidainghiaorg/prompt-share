/**
 * DESIGN PHILOSOPHY: Holographic Glass — Futuristic Minimalism
 * Bilingual prompt library (EN / VI) for all AI tools.
 */

export type AITool =
  | "ChatGPT"
  | "Claude"
  | "Gemini"
  | "Midjourney"
  | "Stable Diffusion"
  | "DALL-E"
  | "Sora"
  | "Runway"
  | "Suno"
  | "GitHub Copilot";

export type CategoryId =
  | "writing"
  | "coding"
  | "image"
  | "video"
  | "music"
  | "business"
  | "education"
  | "marketing"
  | "design"
  | "productivity";

export interface PromptItem {
  id: string;
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  prompt: { en: string; vi: string };
  category: CategoryId;
  tools: AITool[];
  tags: string[];
  author: string;
  likes: number;
  uses: number;
  createdAt: string;
}

export const CATEGORIES: { id: CategoryId; en: string; vi: string; emoji: string }[] = [
  { id: "writing", en: "Writing", vi: "Viết lách", emoji: "✍️" },
  { id: "coding", en: "Coding", vi: "Lập trình", emoji: "</>" },
  { id: "image", en: "Image", vi: "Hình ảnh", emoji: "◐" },
  { id: "video", en: "Video", vi: "Video", emoji: "▶" },
  { id: "music", en: "Music", vi: "Âm nhạc", emoji: "♪" },
  { id: "business", en: "Business", vi: "Kinh doanh", emoji: "◆" },
  { id: "education", en: "Education", vi: "Giáo dục", emoji: "◇" },
  { id: "marketing", en: "Marketing", vi: "Tiếp thị", emoji: "△" },
  { id: "design", en: "Design", vi: "Thiết kế", emoji: "◈" },
  { id: "productivity", en: "Productivity", vi: "Năng suất", emoji: "⬡" },
];

export const PROMPTS: PromptItem[] = [
  {
    id: "p001",
    title: {
      en: "Expert SEO Blog Writer",
      vi: "Chuyên gia viết blog SEO",
    },
    description: {
      en: "Generate a complete SEO-optimized blog article with meta description, headings, and internal link suggestions.",
      vi: "Tạo bài blog chuẩn SEO hoàn chỉnh với meta description, các heading và gợi ý internal link.",
    },
    prompt: {
      en: "Act as an expert SEO content writer with 10+ years of experience. Write a comprehensive blog post about [TOPIC] targeting the keyword [KEYWORD]. Include: 1) an SEO meta title (max 60 chars) and meta description (max 155 chars), 2) a compelling H1, 3) at least 5 H2 sections with H3 subsections where relevant, 4) a clear introduction with a hook, 5) actionable insights with examples, 6) a conclusion with a call-to-action, 7) suggestions for 3 internal links and 2 external authoritative links. Use a conversational yet professional tone. Word count: 1500–2000 words.",
      vi: "Hãy đóng vai chuyên gia viết nội dung SEO với hơn 10 năm kinh nghiệm. Viết một bài blog toàn diện về [CHỦ ĐỀ] nhắm đến từ khóa [TỪ KHÓA]. Bao gồm: 1) meta title SEO (tối đa 60 ký tự) và meta description (tối đa 155 ký tự), 2) một H1 cuốn hút, 3) ít nhất 5 mục H2 với H3 phụ khi cần, 4) phần mở bài có hook hấp dẫn, 5) các insight thực tế kèm ví dụ, 6) kết luận có call-to-action, 7) gợi ý 3 internal link và 2 external link uy tín. Sử dụng giọng văn thân thiện nhưng chuyên nghiệp. Độ dài: 1500–2000 từ.",
    },
    category: "writing",
    tools: ["ChatGPT", "Claude", "Gemini"],
    tags: ["seo", "blog", "content"],
    author: "Mr. Nghĩa",
    likes: 1284,
    uses: 5621,
    createdAt: "2026-04-12",
  },
  {
    id: "p002",
    title: {
      en: "Cinematic Portrait Photography",
      vi: "Chân dung điện ảnh",
    },
    description: {
      en: "Create a stunning cinematic portrait with professional lighting and atmospheric mood.",
      vi: "Tạo ảnh chân dung điện ảnh ấn tượng với ánh sáng chuyên nghiệp và bầu không khí cuốn hút.",
    },
    prompt: {
      en: "Cinematic portrait of [SUBJECT], shot on Arri Alexa 65mm lens, shallow depth of field, golden hour rim lighting, soft volumetric haze, moody color grading inspired by Roger Deakins, ultra detailed skin texture, sharp eyes catchlight, shallow focus on face, slightly desaturated teal and orange palette, photorealistic, 8K resolution, award-winning photography --ar 2:3 --style raw",
      vi: "Ảnh chân dung điện ảnh về [CHỦ THỂ], chụp bằng ống kính Arri Alexa 65mm, độ sâu trường ảnh nông, ánh sáng viền giờ vàng, sương mù mềm mại, tông màu cảm xúc lấy cảm hứng từ Roger Deakins, kết cấu da siêu chi tiết, ánh sáng phản chiếu trong mắt sắc nét, lấy nét nông trên khuôn mặt, bảng màu teal và cam hơi giảm bão hòa, ảnh thực tế, độ phân giải 8K, phong cách giải thưởng --ar 2:3 --style raw",
    },
    category: "image",
    tools: ["Midjourney", "Stable Diffusion", "DALL-E"],
    tags: ["portrait", "cinematic", "photography"],
    author: "Mr. Nghĩa",
    likes: 2156,
    uses: 8932,
    createdAt: "2026-04-18",
  },
  {
    id: "p003",
    title: {
      en: "Senior Code Reviewer",
      vi: "Senior Code Reviewer",
    },
    description: {
      en: "Get a thorough code review with security, performance, and maintainability feedback.",
      vi: "Nhận đánh giá code chi tiết về bảo mật, hiệu năng và khả năng bảo trì.",
    },
    prompt: {
      en: "You are a senior software engineer with expertise in [LANGUAGE/FRAMEWORK]. Review the following code and provide: 1) a summary of what the code does, 2) potential bugs or edge cases, 3) security vulnerabilities, 4) performance bottlenecks, 5) maintainability improvements, 6) refactoring suggestions with code examples, 7) testing recommendations. Format your response with clear sections and severity labels (Critical / High / Medium / Low). Here is the code:\n\n```\n[PASTE CODE HERE]\n```",
      vi: "Bạn là kỹ sư phần mềm cấp cao chuyên sâu về [NGÔN NGỮ/FRAMEWORK]. Hãy review đoạn code sau và cung cấp: 1) tóm tắt chức năng của code, 2) các bug tiềm ẩn hoặc edge case, 3) lỗ hổng bảo mật, 4) điểm nghẽn hiệu năng, 5) cải thiện về maintainability, 6) gợi ý refactor kèm ví dụ code, 7) khuyến nghị testing. Định dạng câu trả lời theo từng phần rõ ràng với nhãn mức độ nghiêm trọng (Critical / High / Medium / Low). Code cần review:\n\n```\n[DÁN CODE VÀO ĐÂY]\n```",
    },
    category: "coding",
    tools: ["ChatGPT", "Claude", "GitHub Copilot"],
    tags: ["review", "refactor", "best-practices"],
    author: "Mr. Nghĩa",
    likes: 1872,
    uses: 6234,
    createdAt: "2026-04-22",
  },
  {
    id: "p004",
    title: {
      en: "Viral TikTok Script Generator",
      vi: "Kịch bản TikTok viral",
    },
    description: {
      en: "Create a 60-second viral TikTok script with hook, story, and CTA.",
      vi: "Tạo kịch bản TikTok 60 giây viral với hook, câu chuyện và CTA.",
    },
    prompt: {
      en: "Write a 60-second TikTok script about [TOPIC] aimed at [TARGET AUDIENCE]. Structure: 1) HOOK (first 3 seconds) — a pattern interrupt that stops scrolling, 2) PROBLEM/STORY (10–20s) — relate to viewer's pain or curiosity, 3) VALUE/SOLUTION (25–40s) — deliver 3 concrete tips, 4) CTA (last 5s) — ask for follow/save/share. Include shot directions in brackets [zoom in], [b-roll], [text overlay]. Use casual Gen-Z tone. End with a question to drive comments.",
      vi: "Viết kịch bản TikTok 60 giây về [CHỦ ĐỀ] nhắm đến [ĐỐI TƯỢNG]. Cấu trúc: 1) HOOK (3 giây đầu) — pattern interrupt khiến người xem dừng lướt, 2) VẤN ĐỀ/CÂU CHUYỆN (10–20s) — kết nối với nỗi đau hoặc tò mò của khán giả, 3) GIÁ TRỊ/GIẢI PHÁP (25–40s) — đưa ra 3 tips cụ thể, 4) CTA (5s cuối) — kêu gọi follow/save/share. Thêm hướng dẫn shot trong ngoặc [zoom in], [b-roll], [text overlay]. Dùng tone Gen-Z thoải mái. Kết bằng câu hỏi để khuyến khích comment.",
    },
    category: "marketing",
    tools: ["ChatGPT", "Claude", "Gemini"],
    tags: ["tiktok", "viral", "social-media"],
    author: "Mr. Nghĩa",
    likes: 3421,
    uses: 12453,
    createdAt: "2026-05-02",
  },
  {
    id: "p005",
    title: {
      en: "Futuristic UI/UX Design Concept",
      vi: "Concept UI/UX tương lai",
    },
    description: {
      en: "Generate a futuristic UI mockup with glassmorphism and aurora gradients.",
      vi: "Tạo mockup UI tương lai với phong cách glassmorphism và gradient aurora.",
    },
    prompt: {
      en: "A futuristic mobile app interface for [APP TYPE], glassmorphism design with translucent frosted glass cards, aurora gradient background of violet cyan and pink, subtle grain texture, floating UI elements with soft shadows, modern typography mixing Space Grotesk display with Inter body, dark mode aesthetic, holographic accents, ultra clean minimalist layout, Apple Vision Pro inspired, 4K render, dribbble shot --ar 9:16",
      vi: "Giao diện ứng dụng di động tương lai cho [LOẠI APP], thiết kế glassmorphism với card kính mờ trong suốt, nền gradient aurora màu tím cyan và hồng, kết cấu hạt mịn, các phần tử UI lơ lửng có bóng mềm, typography hiện đại kết hợp Space Grotesk cho heading và Inter cho body, thẩm mỹ dark mode, điểm nhấn holographic, bố cục tối giản siêu sạch, lấy cảm hứng từ Apple Vision Pro, render 4K, dribbble shot --ar 9:16",
    },
    category: "design",
    tools: ["Midjourney", "Stable Diffusion", "DALL-E"],
    tags: ["ui", "glassmorphism", "futuristic"],
    author: "Mr. Nghĩa",
    likes: 1965,
    uses: 7234,
    createdAt: "2026-05-08",
  },
  {
    id: "p006",
    title: {
      en: "Business Plan Strategist",
      vi: "Chiến lược kế hoạch kinh doanh",
    },
    description: {
      en: "Build a comprehensive lean startup business plan with market analysis.",
      vi: "Xây dựng kế hoạch kinh doanh lean startup toàn diện kèm phân tích thị trường.",
    },
    prompt: {
      en: "Act as a startup strategist with experience advising YC companies. Create a lean business plan for [BUSINESS IDEA] targeting [MARKET]. Include: 1) Problem & solution fit, 2) Unique value proposition, 3) Target customer personas (3 detailed), 4) Market size (TAM/SAM/SOM with rough numbers), 5) Revenue model with pricing tiers, 6) Go-to-market strategy for first 1000 users, 7) Key metrics to track, 8) 12-month roadmap by quarter, 9) Risk assessment and mitigation, 10) Funding requirements. Be specific and data-driven.",
      vi: "Đóng vai chiến lược gia startup có kinh nghiệm tư vấn cho các công ty thuộc YC. Tạo kế hoạch kinh doanh lean cho [Ý TƯỞNG KINH DOANH] nhắm đến [THỊ TRƯỜNG]. Bao gồm: 1) Problem-solution fit, 2) Giá trị độc đáo (UVP), 3) 3 chân dung khách hàng chi tiết, 4) Quy mô thị trường (TAM/SAM/SOM kèm con số ước tính), 5) Mô hình doanh thu với các gói giá, 6) Chiến lược go-to-market cho 1000 user đầu tiên, 7) Chỉ số theo dõi chính, 8) Roadmap 12 tháng theo quý, 9) Đánh giá rủi ro và biện pháp giảm thiểu, 10) Nhu cầu vốn. Hãy cụ thể và dựa trên dữ liệu.",
    },
    category: "business",
    tools: ["ChatGPT", "Claude", "Gemini"],
    tags: ["startup", "strategy", "lean"],
    author: "Mr. Nghĩa",
    likes: 1456,
    uses: 4823,
    createdAt: "2026-04-28",
  },
  {
    id: "p007",
    title: {
      en: "Cinematic Sci-Fi Video Scene",
      vi: "Cảnh video sci-fi điện ảnh",
    },
    description: {
      en: "Generate a cinematic sci-fi scene for AI video tools like Sora or Runway.",
      vi: "Tạo cảnh sci-fi điện ảnh cho các công cụ AI video như Sora hoặc Runway.",
    },
    prompt: {
      en: "A cinematic wide shot of a lone astronaut walking across a glowing crystalline alien landscape under twin suns, slow dolly forward motion, volumetric atmospheric haze, iridescent reflections on the ground, score reminiscent of Hans Zimmer, 24fps, anamorphic lens flares, photoreal, ultra detailed, color graded teal and amber, Blade Runner 2049 inspired cinematography, 8K resolution.",
      vi: "Một cảnh wide shot điện ảnh: phi hành gia đơn độc bước đi trên cảnh quan ngoài hành tinh phát sáng dạng tinh thể dưới hai mặt trời, chuyển động dolly tiến chậm, sương mù khí quyển khối lượng, phản chiếu ngũ sắc trên mặt đất, nhạc nền gợi nhớ Hans Zimmer, 24fps, anamorphic lens flares, photoreal, siêu chi tiết, tông màu teal và amber, lấy cảm hứng từ phong cách quay phim Blade Runner 2049, độ phân giải 8K.",
    },
    category: "video",
    tools: ["Sora", "Runway"],
    tags: ["sci-fi", "cinematic", "scene"],
    author: "Mr. Nghĩa",
    likes: 2789,
    uses: 6453,
    createdAt: "2026-05-10",
  },
  {
    id: "p008",
    title: {
      en: "Lo-Fi Chill Beat Composer",
      vi: "Sáng tác beat lo-fi chill",
    },
    description: {
      en: "Compose a chill lo-fi beat for studying or working.",
      vi: "Sáng tác beat lo-fi chill để học hoặc làm việc.",
    },
    prompt: {
      en: "Lo-fi hip-hop instrumental, 75 BPM, jazzy piano chords with extended 9ths, mellow Rhodes electric piano, dusty boom-bap drums with vinyl crackle, warm sub bass, rainy night ambient texture, subtle saxophone melody in the bridge, nostalgic and introspective mood, perfect for late-night studying, no vocals, 2 minute loop.",
      vi: "Nhạc lo-fi hip-hop instrumental, 75 BPM, hợp âm piano jazzy với extended 9ths, Rhodes electric piano dịu, trống boom-bap bụi bặm kèm tiếng vinyl crackle, sub bass ấm, ambient texture đêm mưa, giai điệu saxophone tinh tế ở đoạn bridge, tâm trạng hoài niệm và nội tâm, hoàn hảo để học khuya, không vocal, loop 2 phút.",
    },
    category: "music",
    tools: ["Suno"],
    tags: ["lofi", "chill", "study"],
    author: "Mr. Nghĩa",
    likes: 1342,
    uses: 4198,
    createdAt: "2026-05-12",
  },
  {
    id: "p009",
    title: {
      en: "Personal Productivity Coach",
      vi: "Coach năng suất cá nhân",
    },
    description: {
      en: "Build a personalized daily schedule based on your goals and energy patterns.",
      vi: "Xây dựng lịch trình hàng ngày cá nhân hóa dựa trên mục tiêu và nhịp năng lượng của bạn.",
    },
    prompt: {
      en: "Act as a productivity coach trained in Cal Newport's deep work and Tim Ferriss's 80/20 frameworks. My goals are: [GOALS]. My current schedule is: [SCHEDULE]. My energy peaks at: [TIME]. Design a realistic 7-day plan that: 1) blocks 3 hours of deep work during my peak energy, 2) batches shallow work, 3) includes recovery rituals, 4) tracks weekly habits, 5) ends with a Friday review template. Output as a daily table with time blocks.",
      vi: "Đóng vai coach năng suất được đào tạo theo deep work của Cal Newport và 80/20 của Tim Ferriss. Mục tiêu của tôi: [MỤC TIÊU]. Lịch hiện tại: [LỊCH]. Năng lượng đỉnh điểm vào: [THỜI GIAN]. Thiết kế một kế hoạch 7 ngày thực tế: 1) chặn 3 giờ deep work vào lúc năng lượng cao nhất, 2) gom nhóm shallow work, 3) bao gồm các nghi thức phục hồi, 4) theo dõi thói quen hàng tuần, 5) kết thúc bằng template review thứ Sáu. Trình bày dưới dạng bảng hàng ngày với các khung giờ.",
    },
    category: "productivity",
    tools: ["ChatGPT", "Claude", "Gemini"],
    tags: ["deep-work", "schedule", "habits"],
    author: "Mr. Nghĩa",
    likes: 987,
    uses: 3245,
    createdAt: "2026-05-15",
  },
  {
    id: "p010",
    title: {
      en: "Socratic Tutor for Any Subject",
      vi: "Gia sư Socrates cho mọi môn học",
    },
    description: {
      en: "Learn any topic faster with a Socratic-method AI tutor.",
      vi: "Học bất kỳ chủ đề nào nhanh hơn với gia sư AI theo phương pháp Socrates.",
    },
    prompt: {
      en: "You are a Socratic tutor expert in [SUBJECT]. My current level is [BEGINNER/INTERMEDIATE/ADVANCED] and I want to learn [SPECIFIC TOPIC]. Instead of giving me answers directly, guide me by: 1) asking probing questions to reveal what I already know, 2) breaking down concepts into first principles, 3) using analogies from everyday life, 4) giving me small exercises to verify understanding, 5) only providing the full explanation after I've genuinely tried. Adapt difficulty to my responses. Start with the first question.",
      vi: "Bạn là gia sư Socrates chuyên về [MÔN HỌC]. Trình độ hiện tại của tôi là [SƠ CẤP/TRUNG CẤP/NÂNG CAO] và tôi muốn học [CHỦ ĐỀ CỤ THỂ]. Thay vì trả lời trực tiếp, hãy hướng dẫn tôi bằng cách: 1) đặt câu hỏi thăm dò để khám phá những gì tôi đã biết, 2) chia nhỏ khái niệm thành các nguyên lý cơ bản, 3) sử dụng phép ẩn dụ từ đời sống hàng ngày, 4) đưa ra bài tập nhỏ để kiểm tra hiểu biết, 5) chỉ giải thích đầy đủ sau khi tôi đã thực sự cố gắng. Điều chỉnh độ khó theo phản hồi của tôi. Bắt đầu với câu hỏi đầu tiên.",
    },
    category: "education",
    tools: ["ChatGPT", "Claude", "Gemini"],
    tags: ["learning", "socratic", "tutor"],
    author: "Mr. Nghĩa",
    likes: 1623,
    uses: 5128,
    createdAt: "2026-05-18",
  },
  {
    id: "p011",
    title: {
      en: "Email Marketing Sequence",
      vi: "Chuỗi email marketing",
    },
    description: {
      en: "Generate a 5-email welcome sequence that converts subscribers into customers.",
      vi: "Tạo chuỗi 5 email chào mừng giúp chuyển đổi subscriber thành khách hàng.",
    },
    prompt: {
      en: "Write a 5-email welcome sequence for [PRODUCT/SERVICE] targeting [AUDIENCE]. Each email should: 1) have a subject line with under 50 characters and a preview text, 2) follow a clear emotional arc (welcome → story → value → social proof → offer), 3) be 150–250 words, 4) include one clear CTA. Format each email with subject, preview, body, and CTA button text. Tone: friendly expert. Goal: 20% open rate, 5% conversion.",
      vi: "Viết chuỗi 5 email chào mừng cho [SẢN PHẨM/DỊCH VỤ] nhắm đến [ĐỐI TƯỢNG]. Mỗi email phải: 1) có subject line dưới 50 ký tự kèm preview text, 2) theo cung bậc cảm xúc rõ ràng (chào mừng → câu chuyện → giá trị → bằng chứng xã hội → ưu đãi), 3) dài 150–250 từ, 4) có một CTA rõ ràng. Định dạng từng email với subject, preview, body và text nút CTA. Tone: chuyên gia thân thiện. Mục tiêu: open rate 20%, conversion 5%.",
    },
    category: "marketing",
    tools: ["ChatGPT", "Claude"],
    tags: ["email", "sequence", "conversion"],
    author: "Mr. Nghĩa",
    likes: 1124,
    uses: 3876,
    createdAt: "2026-05-20",
  },
  {
    id: "p012",
    title: {
      en: "React Component Generator",
      vi: "Tạo React Component",
    },
    description: {
      en: "Generate a production-ready React component with TypeScript and Tailwind.",
      vi: "Tạo React component sẵn sàng production với TypeScript và Tailwind.",
    },
    prompt: {
      en: "Generate a production-ready React component named [COMPONENT NAME] in TypeScript that [DESCRIBE FUNCTIONALITY]. Requirements: 1) use functional component with proper TypeScript interfaces for props, 2) style with Tailwind CSS utility classes only, 3) handle loading/error/empty states, 4) accessible (ARIA labels, keyboard navigation), 5) responsive (mobile-first), 6) include JSDoc comments, 7) export as default. Also provide a usage example. Avoid unnecessary dependencies.",
      vi: "Tạo React component sẵn sàng production tên [TÊN COMPONENT] bằng TypeScript thực hiện [MÔ TẢ CHỨC NĂNG]. Yêu cầu: 1) functional component với interface TypeScript đúng chuẩn cho props, 2) style chỉ bằng utility class Tailwind CSS, 3) xử lý trạng thái loading/error/empty, 4) accessible (ARIA labels, điều hướng bàn phím), 5) responsive (mobile-first), 6) có JSDoc comment, 7) export default. Kèm ví dụ sử dụng. Tránh dependency không cần thiết.",
    },
    category: "coding",
    tools: ["ChatGPT", "Claude", "GitHub Copilot"],
    tags: ["react", "typescript", "tailwind"],
    author: "Mr. Nghĩa",
    likes: 2034,
    uses: 7621,
    createdAt: "2026-05-22",
  },
];
