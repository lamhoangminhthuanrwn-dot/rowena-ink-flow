

## Thêm lịch sử chỉnh sửa giá đơn hàng

### Thay đổi

1. **Tạo bảng `booking_price_history`** (migration)
   - `id` uuid PK
   - `booking_id` uuid FK → bookings
   - `old_price` integer (nullable, giá cũ)
   - `new_price` integer (giá mới)
   - `changed_by` uuid (user_id của admin thực hiện)
   - `created_at` timestamptz
   - RLS: chỉ admin được xem

2. **Cập nhật function `admin_update_booking_price`** (migration)
   - Trước khi update, ghi 1 dòng vào `booking_price_history` với giá cũ, giá mới, và `auth.uid()`

3. **Cập nhật UI trang Ketoan** (`src/pages/Ketoan.tsx`)
   - Thêm icon lịch sử (History) bên cạnh nút chỉnh sửa giá
   - Click vào → hiện dialog/popover liệt kê các lần thay đổi giá: thời gian, giá cũ → giá mới, người thay đổi
   - Query join `booking_price_history` với `profiles` để lấy tên người thay đổi

