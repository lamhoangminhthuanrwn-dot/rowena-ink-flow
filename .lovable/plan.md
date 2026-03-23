

## Thiết kế lại UX/UI theo file Stitch và đồng bộ toàn bộ trang

### Bước 1 — Giải nén và phân tích thiết kế
Giải nén `stitch.zip` để xem 5 mẫu thiết kế (mỗi mẫu gồm `screen.png` + `code.html`):

| Thư mục | Áp dụng cho trang |
|---------|-------------------|
| `the_standard` | Trang chủ (`/`) |
| `archive` | Mẫu xăm (`/mau-xam`) |
| `booking` | Đặt lịch (`/dat-lich`) |
| `artists` | Trang nghệ sĩ (mới) |
| `foyer` | Trang giới thiệu / entry (mới) |

### Bước 2 — Trích xuất design system từ Stitch
Từ code.html của các mẫu, tôi sẽ phân tích:
- **Color palette** → cập nhật CSS variables trong `index.css`
- **Typography** (font, size, weight) → cập nhật Tailwind config
- **Spacing, border-radius, shadows** → cập nhật design tokens
- **Layout patterns** → grid, flex, section structure

### Bước 3 — Cập nhật design tokens & global styles
- `src/index.css` — CSS variables (colors, shadows)
- `tailwind.config.ts` — fonts, spacing, radius
- `src/components/ui/button.tsx` — button variants theo design mới
- `src/components/ui/card.tsx` — card style mới

### Bước 4 — Redesign từng trang
Áp dụng layout và style từ Stitch cho:
1. **Navbar** (`Navbar.tsx`) — navigation style mới
2. **HeroSection** (`HeroSection.tsx`) — hero layout theo `the_standard`
3. **Index** (`Index.tsx`) — trang chủ hoàn chỉnh
4. **Catalog** (`Catalog.tsx`) + `CatalogCard.tsx` — theo `archive`
5. **Booking** (`Booking.tsx`) + sub-components — theo `booking`
6. **Footer** (`Footer.tsx`) — footer style mới
7. Tạo trang mới nếu cần (`Artists`, `Foyer`)

### Bước 5 — Đồng bộ style cho các trang còn lại
Đảm bảo tất cả trang (News, Auth, Account, Success, ProductDetail, AdminFinance...) đều sử dụng cùng design system mới.

### Lưu ý
- Giữ nguyên logic nghiệp vụ (booking flow, auth, admin)
- Chỉ thay đổi phần giao diện và trải nghiệm người dùng
- Responsive cho mobile và desktop
- Sẽ thực hiện theo từng bước, xác nhận sau mỗi trang

