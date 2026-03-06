

## Plan: Điều chỉnh khung hình cho phù hợp với hình gốc

### Vấn đề
Hiện tại khung hình trong trang chi tiết sản phẩm dùng `aspect-[3/4]` (tỷ lệ dọc) và `object-cover`, khiến hình bị crop mất phần nội dung khi hình gốc có tỷ lệ khác.

### Giải pháp
Thay đổi cách hiển thị hình ảnh để fit theo chiều ngang mà không bị crop:

**`src/pages/ProductDetail.tsx`**
- Bỏ `aspect-[3/4]` trên container slideshow, thay bằng container không cố định tỷ lệ
- Đổi `object-cover` thành `object-contain` trong ImageSlideshow để hình không bị cắt

**`src/components/ImageSlideshow.tsx`**
- Thêm prop `objectFit` (mặc định `"cover"`) để linh hoạt cho từng nơi sử dụng
- Trang ProductDetail sẽ truyền `objectFit="contain"` kèm background tối để hình hiển thị đẹp

**`src/components/CatalogCard.tsx`**
- Giữ nguyên `object-cover` cho card trong catalog (vì card cần tỷ lệ đồng nhất)

