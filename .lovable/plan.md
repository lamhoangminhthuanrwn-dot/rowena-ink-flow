

## Đổi tên miền `thuanlam.id.vn` → `rowenatattoos.com`

Tìm thấy **13 files** chứa `thuanlam.id.vn`, cần thay thế toàn bộ thành `rowenatattoos.com`.

### Danh sách files cần sửa

| # | File | Số chỗ cần đổi |
|---|------|----------------|
| 1 | `src/lib/constants.ts` | 1 — SITE_DOMAIN |
| 2 | `src/lib/seo.ts` | 1 — default image URL |
| 3 | `index.html` | 6 — canonical, og:url, og:image, twitter:image, JSON-LD url |
| 4 | `public/robots.txt` | 1 — Sitemap URL |
| 5 | `public/sitemap.xml` | ~15 — tất cả `<loc>` URLs |
| 6 | `supabase/functions/sitemap/index.ts` | 1 — SITE_URL fallback |
| 7 | `supabase/functions/og-meta/index.ts` | 1 — SITE_URL fallback |
| 8 | `supabase/functions/auth-email-hook/index.ts` | 3 — SENDER_DOMAIN, ROOT_DOMAIN, FROM_DOMAIN |
| 9 | `supabase/functions/create-booking/index.ts` | 1 — from address |
| 10 | `supabase/functions/send-booking-email/index.ts` | 1 — PRIMARY_FROM |
| 11 | `supabase/functions/send-price-update-email/index.ts` | 1 — PRIMARY_FROM |
| 12 | `supabase/functions/send-withdrawal-email/index.ts` | 1 — PRIMARY_FROM |
| 13 | `supabase/functions/send-change-payment-email/index.ts` | 2 — resendFrom, confirmUrl |

### Thực hiện
Tìm-và-thay toàn bộ `thuanlam.id.vn` → `rowenatattoos.com` trong tất cả 13 files. Sau đó deploy lại các Edge Functions.

### Lưu ý
- Domain `rowenatattoos.com` cần được verify trên Resend (DNS: MX, SPF, DKIM) để email gửi thành công
- Google sẽ cần vài ngày để cập nhật lại kết quả tìm kiếm với domain mới
- Nếu dùng custom domain cho hosting, cần cấu hình DNS trỏ `rowenatattoos.com` về server

