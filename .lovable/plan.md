

## Đồng bộ kích thước khung cho tất cả mẫu xăm trong Catalog

### Vấn đề
Hiện tại, ảnh đơn dùng `h-auto` (chiều cao tự do theo ảnh gốc), trong khi slideshow dùng `aspect-[3/4]`. Kết quả: các ô có kích thước khác nhau, masonry grid không đều.

### Giải pháp
Bỏ masonry layout, chuyển sang **CSS Grid đều** với tất cả item cùng `aspect-[3/4]` và `object-cover`:

**Catalog.tsx**:
- Thay `.masonry-grid` bằng CSS grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0`
- Tất cả ảnh (đơn lẫn slideshow) đều nằm trong container `aspect-[3/4]` với `object-cover`
- Giữ nguyên hover overlay và grayscale effect

Kết quả: mọi ô đều cùng tỉ lệ 3:4, border đều, không lệch.

