

## Vấn đề

`index.html` dùng `https://rowena-ink-flow.lovable.app` cho canonical, og:url và JSON-LD, trong khi `constants.ts` và `seo.ts` dùng `https://thuanlam.id.vn`. Google Bot thấy 2 domain khác nhau → duplicate content, canonical conflict.

## Giải pháp

Thống nhất tất cả về `https://thuanlam.id.vn` trong `index.html`. Các giá trị trong `index.html` chỉ là fallback trước khi JS chạy (cho crawler không chạy JS) — phải khớp với domain thật.

### Thay đổi duy nhất: `index.html`

Thay tất cả `https://rowena-ink-flow.lovable.app` → `https://thuanlam.id.vn`:
- Line 11: `<link rel="canonical" href="https://thuanlam.id.vn" />`
- Line 21: `<meta property="og:url" content="https://thuanlam.id.vn" />`
- Line 37: `"url": "https://thuanlam.id.vn"` (trong JSON-LD)

Không cần thay đổi file khác — `constants.ts`, `seo.ts`, `robots.txt`, `sitemap.xml`, edge functions đã dùng đúng domain.

