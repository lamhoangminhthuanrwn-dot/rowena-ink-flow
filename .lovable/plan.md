

## Phân tích vấn đề

Hiện tại có ~57 file ảnh trong `public/assets/` (chủ yếu PNG 2-3MB mỗi file) + 3 file trong `src/assets/`. Tổng dung lượng ~30MB+. Đây là nguyên nhân chính gây chậm TTI, LCP, và overall performance.

**Giới hạn quan trọng:** Lovable không có công cụ xử lý ảnh (sharp, imagemagick) để convert/resize ảnh trực tiếp. Có 2 hướng tiếp cận khả thi:

---

## Phương án: Dùng Edge Function làm image proxy với cache

Tạo một edge function đóng vai trò proxy, nhận URL ảnh gốc + tham số width/quality, fetch ảnh gốc, resize và convert sang WebP rồi trả về. Tuy nhiên, Deno edge functions không có native image processing library đủ mạnh.

**Phương án thực tế nhất:** Upload ảnh lên Supabase Storage và dùng tính năng **Image Transformation** có sẵn của Storage (tự động resize, convert WebP, cache CDN).

### Các bước thực hiện:

1. **Tạo Storage bucket** `tattoo-images` (public) trong Lovable Cloud

2. **Tạo edge function `upload-images`** để bulk upload tất cả ảnh từ public URL lên Storage bucket (chạy 1 lần)

3. **Tạo helper function `getOptimizedImageUrl()`** trong code frontend:
   - Nhận path ảnh gốc (e.g. `/assets/tattoo-back-new-1.png`)
   - Trả về Supabase Storage URL với transform params: `?width=800&format=origin` 
   - Catalog card: width=400, ProductDetail: width=800, Hero: width=1200

4. **Cập nhật `tattooDesigns.ts`** — thay đổi tất cả image paths sang Storage URLs

5. **Cập nhật components** (`CatalogCard`, `ProductDetail`, `ImageSlideshow`, `HeroSection`) để dùng optimized URLs

### Kết quả dự kiến:
- PNG 3MB → WebP ~200-400KB (giảm ~85-90%)
- Tổng tải trang giảm từ ~30MB xuống ~3-5MB
- LCP và TTI cải thiện đáng kể

### Lưu ý:
- Supabase Storage Image Transformation là tính năng Pro plan. Nếu không khả dụng, sẽ cần user tự compress ảnh bên ngoài rồi upload lại
- Không thay đổi UX hay design — chỉ thay đổi source URL của ảnh
- `object-contain` vs `object-cover` behavior giữ nguyên

