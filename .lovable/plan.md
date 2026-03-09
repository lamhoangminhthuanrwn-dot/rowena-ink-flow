

## Đổi đường dẫn SEO-friendly: `/` → `/trang-chu`, `/catalog` → `/mau-xam`

### Thay đổi

1. **Routing (`src/App.tsx`)**
   - `"/"` → redirect đến `/trang-chu` (giữ `/` redirect để không break bookmark)
   - `/catalog` → `/mau-xam`, `/catalog/:slug` → `/mau-xam/:slug`
   - Thêm redirect: `/` → `/trang-chu`, `/catalog` → `/mau-xam`, `/catalog/:slug` → redirect tương ứng

2. **Navbar (`src/components/Navbar.tsx`)**
   - Logo link: `/` → `/trang-chu`
   - Nav links: `/catalog` → `/mau-xam`
   - `{ to: "/", label: "Trang chủ" }` → `{ to: "/trang-chu", label: "Trang chủ" }`

3. **HeroSection (`src/components/HeroSection.tsx`)**
   - Link `/catalog` → `/mau-xam`

4. **Footer (`src/components/Footer.tsx`)**
   - Link `/catalog` → `/mau-xam`

5. **Index page (`src/pages/Index.tsx`)**
   - Link `/catalog` → `/mau-xam`

6. **ProductDetail (`src/pages/ProductDetail.tsx`)**
   - "Quay lại" link `/catalog` → `/mau-xam`

7. **Navigate calls** — các `navigate("/")` trong Success, Account, AdminPosts → `/trang-chu`

8. **ReferralRedirect** — redirect to `/trang-chu`

9. **Sitemap (`supabase/functions/sitemap/index.ts`)**
   - `/` → `/trang-chu`, `/catalog` → `/mau-xam`

10. **SEO (`src/lib/seo.ts`)** — kiểm tra nếu có hardcode URL

### Redirects (quan trọng cho SEO)
Thêm route redirect trong App.tsx:
- `<Route path="/" element={<Navigate to="/trang-chu" replace />} />`
- `<Route path="/catalog" element={<Navigate to="/mau-xam" replace />} />`
- `<Route path="/catalog/:slug" element={<OldCatalogRedirect />} />` (redirect sang `/mau-xam/:slug`)

### Files cần sửa
- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/HeroSection.tsx`
- `src/components/Footer.tsx`
- `src/pages/Index.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/Success.tsx`
- `src/pages/Account.tsx`
- `src/pages/AdminPosts.tsx`
- `supabase/functions/sitemap/index.ts`

