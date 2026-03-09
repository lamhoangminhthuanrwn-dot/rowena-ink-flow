

## Cập nhật Sitemap sang domain `thuanlam.id.vn`

Thay tất cả URL trong `public/sitemap.xml` và `public/robots.txt` từ `https://rowena-ink-flow.lovable.app` sang `https://thuanlam.id.vn`.

### Thay đổi

1. **`public/sitemap.xml`** — Đổi 5 URL `loc` sang domain `thuanlam.id.vn`
2. **`public/robots.txt`** — Đổi dòng `Sitemap:` sang `https://thuanlam.id.vn/sitemap.xml`
3. **`supabase/functions/sitemap/index.ts`** — Đổi `SITE_URL` sang `https://thuanlam.id.vn`

