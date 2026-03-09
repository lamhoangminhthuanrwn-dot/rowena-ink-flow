

## Cập nhật sitemap

### Vấn đề
- Edge function `sitemap/index.ts` — đã đúng với routes mới (`/trang-chu`, `/mau-xam`, `/dat-lich`, `/dang-nhap`)
- `public/sitemap.xml` (fallback tĩnh) — còn dùng URL cũ (`/catalog`, `/booking`, `/auth`, `/`)

### Thay đổi
1. **`public/sitemap.xml`** — Cập nhật tất cả URL để khớp với routes mới:
   - `/` → `/trang-chu`
   - `/catalog` → `/mau-xam`
   - `/booking` → `/dat-lich`
   - `/auth` → `/dang-nhap`

Chỉ cần sửa 1 file duy nhất.

