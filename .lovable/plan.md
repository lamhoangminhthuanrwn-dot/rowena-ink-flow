

# Pha 4: Tối ưu SEO Technical

## Phân tích hiện trạng

### Vấn đề phát hiện
1. **Thiếu `resetSEO` cleanup** ở 4 trang: About, Services, Catalog, Branches — gây "rò rỉ" meta tags khi navigate
2. **Thiếu `noindex`** cho các trang hệ thống: Auth, Account, Success, Unsubscribe, Admin pages — hiện `setSEO` luôn set `robots: "index, follow"`
3. **Thiếu `setSEO` hoàn toàn** ở Auth, Account, Success, Unsubscribe — không có title/meta riêng
4. **`buildLocalBusinessJsonLd` thiếu thông tin** — không có telephone, openingHours, sameAs, address đầy đủ cho cả các chi nhánh
5. **Chưa có Service schema** cho trang Dịch vụ
6. **Chưa có FAQ schema** cho trang chủ (FAQSection) và trang Dịch vụ
7. **Sitemap edge function** thiếu các route mới: `/gioi-thieu`, `/dich-vu`, `/chi-nhanh`
8. **`SITE_URL` trong `seo.ts`** được gán trực tiếp từ `SITE_DOMAIN` (là string `"https://rowenatattoos.com"`) — OK nhưng thiếu `https://` prefix check

---

## Thay đổi

### 4A. Nâng cấp `src/lib/seo.ts`

- Thêm option `noindex?: boolean` vào `setSEO`. Khi `true`, set `robots` thành `"noindex, nofollow"`.
- Thêm builder mới: `buildFAQJsonLd(items)` và `buildServiceJsonLd(services)`.
- Mở rộng `buildLocalBusinessJsonLd()` import từ `siteConfig` để tự động fill telephone, openingHours, sameAs, và address array cho tất cả chi nhánh.

### 4B. Thêm SEO + cleanup cho các trang thiếu

| Trang | Thay đổi |
|-------|----------|
| `About.tsx` | Thêm `return () => resetSEO()` |
| `Services.tsx` | Thêm `return () => resetSEO()`, thêm Service schema JSON-LD |
| `Catalog.tsx` | Thêm `return () => resetSEO()` |
| `Branches.tsx` | Thêm `return () => resetSEO()` |
| `Auth.tsx` | Thêm `setSEO({ title: "Đăng nhập", noindex: true })` + cleanup |
| `Account.tsx` | Thêm `setSEO({ title: "Tài khoản", noindex: true })` + cleanup |
| `Success.tsx` | Thêm `setSEO({ title: "Đặt lịch thành công", noindex: true })` + cleanup |
| `Unsubscribe.tsx` | Thêm `setSEO({ title: "Hủy đăng ký", noindex: true })` + cleanup |

### 4C. Thêm FAQ schema vào trang chủ

- `Index.tsx`: import FAQ data từ `FAQSection` (hoặc inline), thêm `buildFAQJsonLd` vào JSON-LD. Kết hợp với LocalBusiness schema hiện có bằng cách set 2 JSON-LD blocks riêng.

### 4D. Cập nhật sitemap edge function

**File**: `supabase/functions/sitemap/index.ts`

- Thêm 3 static routes mới:
  - `/gioi-thieu` — changefreq monthly, priority 0.7
  - `/dich-vu` — changefreq monthly, priority 0.8
  - `/chi-nhanh` — changefreq monthly, priority 0.7

### 4E. Cập nhật `robots.txt`

- Thêm `Disallow: /unsubscribe` (đã có `/huy-dang-ky` nhưng route thật là `/unsubscribe`)

---

## Danh sách file thay đổi

| File | Hành động |
|------|-----------|
| `src/lib/seo.ts` | Thêm `noindex`, `buildFAQJsonLd`, `buildServiceJsonLd`, nâng cấp `buildLocalBusinessJsonLd` |
| `src/pages/About.tsx` | Thêm resetSEO cleanup |
| `src/pages/Services.tsx` | Thêm resetSEO, Service schema |
| `src/pages/Catalog.tsx` | Thêm resetSEO |
| `src/pages/Branches.tsx` | Thêm resetSEO |
| `src/pages/Auth.tsx` | Thêm setSEO noindex + cleanup |
| `src/pages/Account.tsx` | Thêm setSEO noindex + cleanup |
| `src/pages/Success.tsx` | Thêm setSEO noindex + cleanup |
| `src/pages/Unsubscribe.tsx` | Thêm setSEO noindex + cleanup |
| `src/pages/Index.tsx` | Thêm FAQ schema JSON-LD |
| `supabase/functions/sitemap/index.ts` | Thêm routes mới |
| `public/robots.txt` | Cập nhật |

Không cần thay đổi database.

