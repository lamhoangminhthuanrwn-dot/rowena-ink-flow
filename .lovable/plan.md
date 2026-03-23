

## Chuyển hình ảnh catalog sang fit theo chiều ngang

### Thay đổi
Chuyển tất cả hình trong catalog từ `object-cover` (cắt ảnh để lấp đầy khung) sang `object-contain` (hiển thị trọn ảnh, fit theo chiều ngang) và thêm nền `bg-secondary/30` để phần trống không bị trắng.

**Catalog.tsx** — 2 chỗ:
- ImageSlideshow: `objectFit="cover"` → `objectFit="contain"`
- Ảnh đơn: `object-cover` → `object-contain`
- Container `aspect-[3/4]`: thêm `bg-secondary/30`

**CatalogCard.tsx** — tương tự:
- ImageSlideshow & ảnh đơn: chuyển sang `object-contain`
- Thêm `bg-secondary/30` cho container

Kết quả: ảnh hiển thị trọn vẹn không bị cắt, fit theo chiều ngang, nền xám nhạt phía sau.

