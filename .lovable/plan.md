

## Đổi đường dẫn catalog sang slug SEO-friendly

### Thay đổi

1. **Thêm trường `slug` vào `TattooDesign` interface và data** (`src/data/tattooDesigns.ts`)
   - Thêm `slug: string` vào interface
   - Gán slug cho từng design:
     - `"1"` → `"xam-full-lung"`
     - `"2"` → `"xam-full-tay"`
     - `"3"` → `"xam-full-chan"`
     - `"4"` → `"xam-full-nguc-hoac-full-bung"`
     - `"6"` → `"cover-hinh-xam-cu"`
     - `"7"` → `"xam-hinh-mini-a4"`
     - `"9"` → `"xam-theo-yeu-cau-khac"`

2. **Cập nhật routing** (`src/App.tsx`)
   - Route `/catalog/:id` → `/catalog/:slug`

3. **Cập nhật link catalog card** (`src/components/CatalogCard.tsx`)
   - Link `to={/catalog/${design.id}}` → `to={/catalog/${design.slug}}`

4. **Cập nhật ProductDetail** (`src/pages/ProductDetail.tsx`)
   - `useParams()` lấy `slug` thay vì `id`
   - Tìm design bằng `d.slug === slug`
   - Link booking: `design=${design.id}` giữ nguyên (booking dùng id nội bộ)

5. **Cập nhật sitemap** (`supabase/functions/sitemap/index.ts`)
   - Nếu có query products từ DB thì cập nhật slug tương ứng (hiện tại đã dùng `p.slug`)

6. **Cập nhật SEO** (`src/lib/seo.ts`)
   - SITE_URL canonical sẽ tự động đúng vì dùng `window.location.pathname`

### Các file cần sửa
- `src/data/tattooDesigns.ts` — thêm slug vào interface + data
- `src/App.tsx` — route param
- `src/components/CatalogCard.tsx` — link href
- `src/pages/ProductDetail.tsx` — lookup by slug
- Không cần sửa `Booking.tsx` vì vẫn dùng `design=id` qua query param

