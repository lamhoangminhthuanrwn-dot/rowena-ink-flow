

# Xuất website Rowena Tattoo thành HTML/CSS/JS tĩnh

## Tổng quan

Tạo 3 file tải về (`index.html`, `styles.css`, `script.js`) chứa toàn bộ nội dung các trang landing: Trang chủ, Giới thiệu, Dịch vụ, Chi nhánh — dưới dạng single-page với navigation scroll/toggle giữa các section. Project React giữ nguyên.

## Cấu trúc file

### `index.html`
- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Navbar cố định với menu items + mobile hamburger
- 4 "trang" dưới dạng section: `#home`, `#about`, `#services`, `#branches`
- Nội dung hardcode từ dữ liệu hiện có (siteConfig, FAQ, services, reviews, branches)
- SEO: meta tags, Open Graph, JSON-LD (LocalBusiness + FAQ)
- Google Fonts: Space Grotesk, Oswald, JetBrains Mono
- Sticky mobile CTA bar (Gọi / Zalo / Đặt lịch)

### `styles.css`
- CSS Variables cho dark/light theme (giữ đúng palette hiện tại: `--primary: #bb1b1b`, dark nền `#1a1a1a`)
- Brutalist design: border-radius 0, border lines, uppercase tracking
- Responsive: mobile-first, breakpoints 768px / 1024px / 1440px
- Transitions/transforms cho hover effects, menu toggle, accordion
- Grayscale hover effect cho portfolio images

### `script.js`
- Vanilla JS, no dependencies
- Dark/light theme toggle (localStorage persist)
- Mobile menu open/close
- FAQ accordion toggle
- Branch tab switching (footer map)
- Smooth scroll navigation
- Intersection Observer cho lazy-load maps

## Nội dung các section

| Section | Nội dung |
|---------|----------|
| Hero | Headline + 2 CTA (Đặt lịch, Xem mẫu xăm) |
| Tại sao chọn Rowena | 4 cards: Tay nghề, Vệ sinh, Tư vấn, Chi nhánh |
| Bộ sưu tập | 3 cards placeholder (Full Body, Mini, Đặc biệt) |
| Đội ngũ | Placeholder grid (static, không query DB) |
| Chi nhánh | 4 branch cards với hotline, địa chỉ, CTA |
| Khách hàng nói gì | 3 review cards |
| FAQ | 6 câu hỏi accordion |
| Final CTA | Đặt lịch + Zalo |
| Giới thiệu | Story, Values, Process |
| Dịch vụ | 4 service cards + FAQ riêng |
| Chi nhánh detail | 4 branches với map embed |
| Footer | Links, Contact, Social, Map |

## Liên kết giữa các file

```text
index.html
  ├── <link href="styles.css">     ← toàn bộ visual
  ├── <script src="script.js">     ← toàn bộ interactivity
  ├── nav links → scroll đến #about, #services, #branches
  └── CTA links → href Zalo/Hotline (external)

styles.css
  ├── :root / .dark           ← theme variables
  ├── layout classes           ← .container, .grid, .section
  ├── component classes        ← .navbar, .card, .accordion
  └── @media queries           ← responsive breakpoints

script.js
  ├── themeToggle()            ← đọc/ghi localStorage, toggle .dark
  ├── mobileMenu()             ← hamburger open/close
  ├── accordion()              ← FAQ expand/collapse
  ├── branchTabs()             ← footer map switching
  └── smoothScroll()           ← nav link scroll behavior
```

## Đầu ra

3 file xuất ra `/mnt/documents/`:
- `index.html`
- `styles.css`  
- `script.js`

