

## Hiển thị slideshow mẫu xăm trên trang chủ

### Thay đổi

**Index.tsx** — 2 chỗ cần cập nhật:

1. **Ảnh lớn bên trái (featured[0])** — dòng 34-40: Nếu design có nhiều ảnh (`images.length > 1`), dùng `ImageSlideshow` thay vì `<img>` đơn. Giữ `objectFit="contain"`, `grayscale`, `showArrows`.

2. **Danh sách sản phẩm bên phải** — dòng 65-66: Thumbnail nhỏ (14x14), nếu có nhiều ảnh thì dùng `ImageSlideshow` với `showArrows={false}`, `showDots={false}` (auto-slide only vì quá nhỏ).

Import thêm `ImageSlideshow` vào file.

