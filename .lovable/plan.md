

## Hiển thị slideshow hình ảnh trên catalog card

### Hiện trạng
- Catalog page (`src/pages/Catalog.tsx`) đã import `ImageSlideshow` nhưng không sử dụng — luôn hiển thị ảnh tĩnh `d.image` ngay cả khi design có mảng `images[]` nhiều ảnh.
- Component `ImageSlideshow` đã hoàn chỉnh với auto-play, dots, arrows.
- `CatalogCard` component cũng chỉ hiển thị ảnh tĩnh.

### Thay đổi

**1. Catalog.tsx — Thay ảnh tĩnh bằng slideshow khi có nhiều ảnh**
- Nếu `d.images.length > 1`: render `ImageSlideshow` với `aspect-[3/4]`, `objectFit="cover"`, ẩn dots/arrows mặc định, chỉ hiện arrows khi hover.
- Nếu chỉ có 1 ảnh: giữ nguyên `<img>`.

**2. CatalogCard.tsx — Tương tự, thêm slideshow**
- Thay thế `<img>` bằng `ImageSlideshow` khi design có nhiều ảnh.

**3. ImageSlideshow — Điều chỉnh nhỏ**
- Thêm prop `grayscale` (mặc định `false`) để áp dụng hiệu ứng grayscale-hover phù hợp với style catalog.
- Ngăn click vào arrow/dot không navigate sang trang chi tiết (đã có `e.preventDefault()` + `e.stopPropagation()`).

### Kết quả
Mỗi mẫu xăm trong danh mục sẽ tự động chuyển ảnh (slideshow) nếu có nhiều hình, giúp khách hàng xem preview nhiều góc ngay trên trang catalog.

