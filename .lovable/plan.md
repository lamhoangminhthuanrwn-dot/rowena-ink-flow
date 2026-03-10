

## Cập nhật Edge Function sitemap

Hiện tại Edge Function chỉ lấy sản phẩm từ bảng `products` trong database (không có dữ liệu active). Các mẫu xăm thực tế nằm trong `tattooDesigns.ts` với 7 slug hardcoded. Cần thêm các slug này trực tiếp vào Edge Function.

### Thay đổi

**`supabase/functions/sitemap/index.ts`**:
- Thêm mảng `hardcodedProductSlugs` chứa 7 slug từ `tattooDesigns.ts`:
  - `xam-full-lung`, `xam-full-tay`, `xam-full-chan`, `xam-full-nguc-hoac-full-bung`, `cover-hinh-xam-cu`, `xam-hinh-mini-a4`, `xam-theo-yeu-cau-khac`
- Sau khi thêm products từ DB, thêm các slug hardcoded (loại trừ trùng lặp với DB) vào sitemap với priority `0.7`
- Giữ nguyên logic lấy posts và products từ DB

**`supabase/config.toml`**:
- Thêm `[functions.sitemap]` với `verify_jwt = false` (function công khai)

