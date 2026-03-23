

## Dùng logo mới cho giao diện sáng

### Thay đổi

1. **Copy logo mới** vào `src/assets/logo-rowena-light.png`

2. **Navbar.tsx** — Import cả 2 logo, dùng `theme` từ `useTheme` để chọn:
   - Light → `logo-rowena-light.png` (logo đen+đỏ trên nền trắng)
   - Dark → `logo-rowena.png` (logo hiện tại)

3. **Footer.tsx** — Tương tự: import `useTheme` + cả 2 logo, chuyển đổi theo theme.

