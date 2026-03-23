

## Cập nhật robots.txt

### Thay đổi

**public/robots.txt** — Viết lại hoàn toàn:

1. **Chặn các route private/admin** khỏi bot crawl:
   - `/tai-khoan`, `/ketoan`, `/admin/`, `/success`, `/dang-nhap`
   - Các redirect cũ: `/booking`, `/auth`, `/account`
   - `/huy-dang-ky` (unsubscribe)

2. **Đổi Sitemap URL** trỏ về edge function động thay vì file tĩnh:
   - `Sitemap: https://qbbvnjnpbbpskhwngsrq.supabase.co/functions/v1/sitemap`

3. **Đơn giản hóa** — dùng 1 block `User-agent: *` chung với Allow `/` và các Disallow cụ thể, giữ riêng block cho social bot (Twitterbot, facebookexternalhit) chỉ Allow.

