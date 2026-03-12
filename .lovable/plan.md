

## Phân tích: Lazy load Index page

### Hiện trạng
`Index` được import trực tiếp trong `App.tsx` — là trang duy nhất không lazy load.

### Đánh giá
- `Index` chỉ chứa `HeroSection` (1 ảnh tĩnh + text), `FloatingCTA`, và 3 `CatalogCard` — khá nhẹ.
- Đây là landing page — route `/` — nơi đa số user truy cập đầu tiên.
- Lazy load landing page sẽ thêm 1 round-trip + hiện spinner trước khi render nội dung chính → **giảm perceived performance**.
- Các trang khác (Catalog, Booking, Admin...) đã lazy load đúng.

### Kết luận
**Giữ nguyên** — không nên lazy load Index. Đây là tradeoff UX đúng: landing page cần render ngay lập tức, không nên cho user thấy spinner ở trang đầu tiên.

Nếu muốn giảm bundle size thêm, hướng tốt hơn là:
- Code-split `framer-motion` (nặng ~30KB gzipped) bằng dynamic import
- Optimize hero image (WebP, srcset)

Không cần thay đổi code cho item này.

