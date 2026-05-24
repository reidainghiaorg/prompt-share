# Ý tưởng thiết kế cho PromptShare

## Bối cảnh
Web app chia sẻ Prompt miễn phí, hỗ trợ 2 ngôn ngữ (EN/VI), giao diện tối giản, màu sắc futuristic.

---

<response>
<text>
### Ý tưởng 1: "Neon Terminal" — Cyberpunk Minimalism
- Design Movement: Cyberpunk Brutalism + Terminal UI
- Color: deep black + neon cyan/magenta
- Typography monospace cho prompt, sans-serif cho UI
- Asymmetric grid, sidebar trái
- Glow effect, glitch animation
</text>
<probability>0.04</probability>
</response>

<response>
<text>
### Ý tưởng 2: "Holographic Glass" — Futuristic Minimalism (CHỌN)
- Design Movement: Glassmorphism + Aurora Gradient + Apple Vision Pro aesthetic
- Core Principles:
  - Tối giản nhưng có chiều sâu nhờ blur và transparency
  - Aurora gradient mượt (violet → cyan → pink) làm điểm nhấn phía sau
  - Nội dung là trung tâm, UI lùi về phía sau
  - Cảm giác lơ lửng, trong suốt như công nghệ tương lai
- Color Philosophy:
  - Background: gradient deep navy → black
  - Aurora glow: violet #7c3aed, cyan #06b6d4, pink #ec4899 (blob mờ background)
  - Glass surface: rgba(255,255,255,0.05) với border rgba(255,255,255,0.1)
  - Text: #f5f5fa primary, #94a3b8 muted
  - Accent CTA: cyan #06b6d4
- Layout Paradigm: Header sticky blur, hero asymmetric với aurora blob, masonry grid cho prompt cards, sidebar filter collapse mobile
- Signature Elements: Aurora animated blobs, glass cards border sáng, subtle grain noise overlay
- Interaction: hover glow border, click scale 0.97, toast slide từ phải
- Animation: aurora drift 20s loop, cards fade-up stagger 60ms, copy button checkmark morph
- Typography: Space Grotesk (display 600-700), Inter (body 400-500), JetBrains Mono (prompt code)
</text>
<probability>0.07</probability>
</response>

<response>
<text>
### Ý tưởng 3: "Quantum Light" — Light Futurism
- Swiss Modernism + Soft Tech
- Off-white background, indigo/cyan accents
- 12-column grid chặt chẽ, centered
- Fade nhẹ, không glow
</text>
<probability>0.03</probability>
</response>

---

## Quyết định: **Ý tưởng 2 — Holographic Glass**

Phù hợp nhất với yêu cầu "tối giản + futuristic". Glassmorphism + aurora gradient mang lại cảm giác công nghệ tương lai mà vẫn tối giản (nội dung dẫn dắt, UI chỉ là khung).
