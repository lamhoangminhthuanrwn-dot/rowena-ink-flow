

## Đổi đường dẫn SEO-friendly: `/booking` → `/dat-lich`, `/auth` → `/dang-nhap`, `/account` → `/tai-khoan`

### Mapping
| Cũ | Mới |
|---|---|
| `/booking` | `/dat-lich` |
| `/auth` | `/dang-nhap` |
| `/account` | `/tai-khoan` |
| `/tin-tuc` | giữ nguyên |

### Thay đổi

1. **`src/App.tsx`** — Đổi route path + thêm redirect từ URL cũ:
   - `/dat-lich` → Booking, `/dang-nhap` → Auth, `/tai-khoan` → Account
   - Redirect: `/booking` → `/dat-lich`, `/auth` → `/dang-nhap`, `/account` → `/tai-khoan`

2. **`src/components/Navbar.tsx`** — Đổi tất cả link:
   - `/booking` → `/dat-lich`, `/account` → `/tai-khoan`, `/auth` → `/dang-nhap`
   - Cập nhật `location.pathname` checks tương ứng

3. **`src/components/HeroSection.tsx`** — `/booking` → `/dat-lich`

4. **`src/components/Footer.tsx`** — `/booking` → `/dat-lich`, `/account` → `/tai-khoan`

5. **`src/components/FloatingCTA.tsx`** — `/booking` → `/dat-lich`

6. **`src/components/AdminRoute.tsx`** — redirect `/auth` → `/dang-nhap`

7. **`src/pages/Auth.tsx`** — navigate `/account` → `/tai-khoan`

8. **`src/pages/Account.tsx`** — navigate `/auth` → `/dang-nhap`, `/booking` → `/dat-lich`

9. **`src/pages/ProductDetail.tsx`** — link `/booking?design=` → `/dat-lich?design=`

10. **`supabase/functions/sitemap/index.ts`** — cập nhật `/booking` → `/dat-lich`, `/auth` → `/dang-nhap`

### Files cần sửa (10 files)
`App.tsx`, `Navbar.tsx`, `HeroSection.tsx`, `Footer.tsx`, `FloatingCTA.tsx`, `AdminRoute.tsx`, `Auth.tsx`, `Account.tsx`, `ProductDetail.tsx`, `sitemap/index.ts`

