

## Thêm nút chuyển giao diện sáng/tối + thiết kế giao diện sáng

### Hiện trạng
- `:root` và `.dark` đều dùng cùng bảng màu tối (dark-only). HTML có `class="dark"`.
- Chưa có light theme CSS hay nút toggle.

### Thay đổi

**1. index.css — Thiết kế light theme**
- `:root` sẽ chứa bảng màu sáng mới, giữ brutalist style:
  - Background: trắng ấm `0 0% 96%`, foreground: gần đen `0 0% 10%`
  - Card/popover: `0 0% 100%` (trắng)
  - Primary: giữ nguyên đỏ `0 75% 42%` (brand color)
  - Secondary: xám nhạt `0 0% 90%`
  - Muted: `240 5% 78%` / foreground `240 5% 40%`
  - Border/input: `240 5% 82%`
  - Shadows nhẹ hơn (opacity thấp hơn)
- `.dark` giữ nguyên bảng màu tối hiện tại.

**2. Tạo hook `useTheme` — Quản lý theme state**
- Lưu preference vào `localStorage` key `theme`.
- Toggle class `dark` trên `<html>`.
- Mặc định: `dark` (giữ trải nghiệm hiện tại).

**3. Navbar.tsx — Thêm nút toggle Sun/Moon**
- Icon `Sun`/`Moon` từ lucide-react, đặt cạnh nút tài khoản.
- Click để chuyển đổi sáng/tối.

**4. CSS hardcoded colors — Cập nhật**
- Các CSS class như `.brutalist-input`, `.meta-overlay`, `::selection` đang hardcode màu HSL → chuyển sang dùng CSS variables để tương thích cả 2 theme.

### Kết quả
Người dùng có thể chuyển đổi giữa giao diện sáng (trắng ấm, brutalist) và tối (hiện tại) bằng nút trên navbar. Preference được lưu lại giữa các phiên.

