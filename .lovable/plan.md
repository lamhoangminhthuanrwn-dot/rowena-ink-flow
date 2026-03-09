

## Cho phép kế toán chỉnh sửa giá trị đơn hàng

### Thay đổi

1. **Tạo DB function `admin_update_booking_price`** (migration)
   - Function RPC nhận `_booking_id uuid` và `_total_price integer`
   - Kiểm tra quyền admin, cập nhật `total_price` và `updated_at`

2. **Cập nhật UI trang Ketoan** (`src/pages/Ketoan.tsx`)
   - Thêm state `editPriceId` và `editPriceValue` để track booking đang chỉnh sửa giá
   - Ở cột giá trị (total_price), khi booking chưa hoàn thành: hiển thị icon bút chỉnh sửa bên cạnh giá
   - Click vào → hiện input số để nhập giá mới + nút Lưu/Hủy
   - Gọi RPC `admin_update_booking_price` khi lưu, refresh danh sách

### Chi tiết kỹ thuật

- Function mới dùng `SECURITY DEFINER` + `has_role()` giống các function admin hiện có
- Chỉ cho phép chỉnh sửa khi `booking_status != 'completed'` để tránh sửa đơn đã hoàn thành
- Input giá dùng `type="number"` với format VNĐ

