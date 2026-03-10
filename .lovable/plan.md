

## Cập nhật sitemap.xml tĩnh

Hiện tại file `public/sitemap.xml` chỉ có 5 route tĩnh. Cần bổ sung:

### Dữ liệu từ database và static data

**Sản phẩm (từ `tattooDesigns.ts` - không có sản phẩm active trong DB):**
- `/mau-xam/xam-full-lung`
- `/mau-xam/xam-full-tay`
- `/mau-xam/xam-full-chan`
- `/mau-xam/xam-full-nguc-hoac-full-bung`
- `/mau-xam/cover-hinh-xam-cu`
- `/mau-xam/xam-hinh-mini-a4`
- `/mau-xam/xam-theo-yeu-cau-khac`

**Bài viết (từ bảng `posts`):**
- `/tin-tuc/khuyen-mai-thang-3-giam-20-xam-mini`
- `/tin-tuc/huong-dan-cham-soc-hinh-xam`
- `/tin-tuc/rowena-khai-truong-chi-nhanh-quan-7`

(Bỏ qua bài `test` vì không phải nội dung thực.)

### Thay đổi

**`public/sitemap.xml`** — Thêm 7 URL sản phẩm (priority 0.7) và 3 URL bài viết (priority 0.6) vào sau các route tĩnh hiện có.

