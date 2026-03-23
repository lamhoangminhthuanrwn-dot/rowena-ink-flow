

## Đổi logo Diamond thành logo Rowena

### Thay đổi
1. **Copy ảnh logo** vào `src/assets/logo-rowena.png`
2. **Navbar** (`src/components/Navbar.tsx`): Xóa `DiamondIcon`, thay bằng `<img>` import từ `@/assets/logo-rowena.png`, kích thước ~32px height
3. **Footer** (`src/components/Footer.tsx`): Tương tự, thay tất cả `DiamondIcon` bằng logo image, kích thước phù hợp (20-24px cho footer)

### Chi tiết kỹ thuật
- Import logo: `import logoRowena from "@/assets/logo-rowena.png"`
- Thay `<DiamondIcon className="size-5 text-primary" />` → `<img src={logoRowena} alt="Rowena" className="h-8 w-auto" />`
- Giữ nguyên toàn bộ layout và logic hiện tại

