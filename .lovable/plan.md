

# Pha 3: Giảm cảm giác web bán hàng + Tối ưu Booking

## Thay đổi

### 3A. Ẩn "ĐĂNG NHẬP" khỏi Navbar chính

**File**: `src/components/Navbar.tsx`

- Desktop: Xóa link "ĐĂNG NHẬP" cho guest. Chỉ hiển thị icon User nhỏ khi đã đăng nhập (giữ nguyên nút TÀI KHOẢN).
- Mobile menu: Tương tự — ẩn "ĐĂNG NHẬP", chỉ hiện "TÀI KHOẢN" khi đã login.
- Giữ route `/dang-nhap` hoạt động bình thường, chỉ không quảng bá trên menu.

### 3B. Thêm CTA Zalo thay thế vào trang Booking

**File**: `src/pages/Booking.tsx`

- Thêm một khối nhỏ phía dưới nút navigation (sau `border-t`):
  ```text
  ── Hoặc liên hệ nhanh ──
  [📞 Gọi hotline] [💬 Nhắn Zalo]
  ```
- Import `siteConfig` để lấy `hotlineHref` và `zaloLink`.
- Chỉ hiển thị trên mọi step để khách luôn có lựa chọn thay thế.

### 3C. Thêm CTA Zalo vào ProductDetail

**File**: `src/pages/ProductDetail.tsx`

- Dưới nút "ĐẶT LỊCH VỚI MẪU NÀY", thêm link phụ: "Hoặc nhắn Zalo tư vấn"
- Import `siteConfig.zaloLink`.

### 3D. Cải thiện Success page

**File**: `src/pages/Success.tsx`

- Thêm CTA Zalo bên cạnh thông tin booking: "Nhắn Zalo để được hỗ trợ nhanh hơn"

---

## Tổng hợp file thay đổi

| File | Hành động |
|------|-----------|
| `src/components/Navbar.tsx` | Ẩn ĐĂNG NHẬP cho guest |
| `src/pages/Booking.tsx` | Thêm khối CTA Zalo/Hotline thay thế |
| `src/pages/ProductDetail.tsx` | Thêm link Zalo phụ |
| `src/pages/Success.tsx` | Thêm CTA Zalo hỗ trợ |

Không cần thay đổi database.

